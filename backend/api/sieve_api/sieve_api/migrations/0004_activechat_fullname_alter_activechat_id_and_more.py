# Generated by Django 4.2.16 on 2024-10-22 21:17

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('sieve_api', '0003_activechat_feedback_choice_audio_alter_activechat_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='activechat',
            name='fullname',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='activechat',
            name='id',
            field=models.UUIDField(default=uuid.UUID('03b9f8de-dcfb-42eb-8415-d5d861de9d79'), editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='choice',
            name='id',
            field=models.UUIDField(default=uuid.UUID('4e562513-14bb-440a-a57d-30974ed2e682'), editable=False, primary_key=True, serialize=False),
        ),
    ]