from django import forms
from django.contrib.auth.forms import AuthenticationForm

from .models import User


class LoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ('username', 'password',)


class AddUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'name', 'role', 'password',)
        widgets = {
            'email': forms.TextInput(attrs={
                'class': 'w-full py-4 px-6 rounded-xl border mb-[15px]'
            }),
            'name': forms.TextInput(attrs={
                'class': 'w-full py-4 px-6 rounded-xl border mb-[15px]'
            }),
            'role': forms.Select(attrs={
                'class': 'w-full py-4 px-6 rounded-xl border mb-[15px]'
            }),
            'password': forms.TextInput(attrs={
                'class': 'w-full py-4 px-6 rounded-xl border mb-[15px]'
            })
        }


class EditUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'name', 'role',)
        widgets = {
            'email': forms.TextInput(attrs={
                'class': 'w-full py-4 px-6 rounded-xl border mb-[15px]'
            }),
            'name': forms.TextInput(attrs={
                'class': 'w-full py-4 px-6 rounded-xl border mb-[15px]'
            }),
            'role': forms.Select(attrs={
                'class': 'w-full py-4 px-6 rounded-xl border mb-[15px]'
            })
        }