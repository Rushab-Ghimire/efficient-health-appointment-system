# Generated by Django 5.2.3 on 2025-07-18 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_user_date_of_birth_user_gender'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='user_profiles/'),
        ),
    ]
