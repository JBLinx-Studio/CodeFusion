
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Github, UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: () => void;
  switchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, switchToLogin }) => {
  const { register, googleLogin } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await register(data.email, data.password, data.name);
    if (success) {
      onSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    const success = await googleLogin();
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="John Doe" 
                  {...field} 
                  className="bg-[#131620] border-[#374151]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
                  {...field} 
                  className="bg-[#131620] border-[#374151]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="bg-[#131620] border-[#374151]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5]"
            disabled={form.formState.isSubmitting}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full border border-[#374151] hover:bg-[#1e293b]"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.4c-1.1 5.4-5.9 8.6-11.4 8.6-7 0-12.6-5.6-12.6-12.6S17 11.4 24 11.4c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.4 5.1 29.5 3 24 3 13.5 3 5 11.5 5 22s8.5 19 19 19 19-8.5 19-19c0-.7 0-1.3-.1-2h-19.8z"/>
              <path fill="#FF3D00" d="M5.8 13.5l6.6 4.8C14.3 13.3 18.8 10 24 10c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.4 4.1 29.5 2 24 2 15.5 2 8.2 6.7 5.8 13.5z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 10-1.9 13.7-5.2L31.9 33c-2.1 1.4-4.8 2.2-7.9 2.2-5.5 0-10.3-3.2-11.4-8.6l-6.6 5.1C9.3 38.5 16.1 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.4c-.6 2.9-2.2 5.5-4.5 7.2l5.7 5.8c4-3.5 6.4-8.7 6.4-15 0-.7 0-1.3-.1-2h-19.8z"/>
            </svg>
            Sign up with Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full border border-[#374151] hover:bg-[#1e293b]"
          >
            <Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>
        </div>
        
        <div className="text-center mt-4 text-sm">
          <span className="text-[#9ca3af]">Already have an account?</span>{' '}
          <Button 
            variant="link" 
            onClick={switchToLogin} 
            className="p-0 h-auto text-[#6366f1] hover:text-[#818cf8]"
          >
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
};
