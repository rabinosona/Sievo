import uuid
import re
import os
from sieve_api.db.models import ActiveChat, Choice
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from openai import OpenAI
from .settings import MASTER_PROMPT, CONVERSATION, OPEN_API_KEY, MEDIA_ROOT

client = OpenAI(api_key=OPEN_API_KEY)


# Set your OpenAI API key (secure this properly in production)

class SessionStartView(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not self.is_valid_email(email):
            return Response({"error": "Email is malformed."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chat_id = uuid.uuid4()

            chat = ActiveChat.objects.create(
                id=chat_id, created=timezone.now(), email=email)

            return Response({
                'chat_id': chat.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def is_valid_email(self, email):
        """Check if the email is a valid format."""
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return bool(re.match(pattern, email))


class ResponseView(APIView):
    def post(self, request):
        chat_id = request.data.get('chat_id')

        if not request.FILES:
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        audio = request.FILES['file']

        if not audio:
            return Response({"error": "Audio is empty."}, status=status.HTTP_400_BAD_REQUEST)

        file_path = self.write_to_disc(audio)
        prompt = None

        try:
            active_chat = ActiveChat.objects.get(id=chat_id)

            if not active_chat:
                return Response({'error': 'The chat doesn\'t exist'}, status=status.HTTP_404_NOT_FOUND)

            messages = Choice.objects.filter(chat_id=active_chat.id)

            lines = [{'index': m.index, 'content': m.content, 'role': m.role}
                     for m in messages]
            lines.sort(key=lambda m: m['index'])

            max_index = 0

            if len(lines) > 0:
                max_index = max(l['index'] for l in lines)

            if max_index // 2 >= len(CONVERSATION):
                return Response({'error': 'You ran out of questions.'}, status=status.HTTP_400_BAD_REQUEST)

            question = CONVERSATION[max_index // 2]

            try:
                with open(file_path, 'rb') as f:
                    response = client.audio.transcriptions.create(
                        model="whisper-1", file=f)

                if not response or not response.text:
                    return Response({"error": "Transcription failed or didn't return any results."},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                prompt = response.text

            finally:
                # Step 3: Optionally delete the file from disk after processing
                if os.path.exists(file_path):
                    os.remove(file_path)

            if not prompt:
                return Response({"error": "Transcription returned empty result."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            self.create_message(active_chat, max_index +
                                1, question, 'assistant')
            user_message = self.create_message(
                active_chat, max_index + 2, prompt, 'user')

            user_message.audio = audio
            user_message.save()

            return Response({
                'question': CONVERSATION[(max_index + 2) // 2]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def write_to_disc(self, audio):
        file_path = os.path.join(MEDIA_ROOT, audio.name)

        with open(file_path, 'wb+') as destination:
            for chunk in audio.chunks():
                destination.write(chunk)

        return file_path

    def create_message(self, chat_id, index, content, role):
        new_id = uuid.uuid4()

        mes = Choice.objects.create(
            id=new_id, chat_id=chat_id, index=index, content=content, role=role)

        return mes


class SubmitView(APIView):
    def post(self, request):
        chat_id = request.data.get('chat_id')

        if not chat_id:
            return Response({"error": 'Chat ID was not provided.'}, status=status.HTTP_400_BAD_REQUEST)

        messages = Choice.objects.filter(chat_id=chat_id).order_by('index')

        lines = [{'content': m.content, 'role': m.role, 'audio_url': m.audio.url if m.audio else None } for m in messages]
        lines.insert(0, {'role': 'system', 'content': MASTER_PROMPT})

        completion = client.chat.completions.create(
            model='gpt-4o', messages=lines)

        feedback = completion.choices[0].message

        chat = ActiveChat.objects.get(id=chat_id)

        chat.feedback = feedback.content
        chat.save()

        return Response({
            'feedback': feedback.content,
            'conversation': lines[1:len(lines)],
            'email': chat.email
        })