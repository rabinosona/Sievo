from django.db import models
import uuid

class ActiveChat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    object = models.CharField(max_length=255)
    created = models.DateTimeField()
    model = models.CharField(max_length=255)
    email = models.CharField(max_length=255, default='', blank=False)
    
    feedback = models.TextField(default='')

    def __str__(self):
        return f"ChatCompletionResponse {self.id}"
    class Meta:
        app_label = 'sieve_api' 

class Choice(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    index = models.IntegerField(default=0)
    fullname = models.CharField(max_length=255, default='')
    
    role = models.CharField(max_length=255, default='')
    content = models.TextField(default='')
    audio = models.FileField(upload_to='uploads', default=None)
    chat_id = models.ForeignKey(ActiveChat, default=None, on_delete=models.CASCADE, related_name="chats")

    def __str__(self):
        return f"Choice {self.index}"
    class Meta:
        app_label = 'sieve_api' 