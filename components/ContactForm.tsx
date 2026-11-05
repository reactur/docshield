'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');

    const { error } = await supabase.from('contact_messages').insert({
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    });

    if (error) {
      setStatus('error');
      return;
    }
    form.reset();
    setStatus('sent');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/60 bg-secondary/20 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" required maxLength={100} autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required maxLength={255} autoComplete="email" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" required maxLength={5000} rows={6} />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-destructive">
          Your message could not be sent. Please try again in a moment.
        </p>
      )}
      {status === 'sent' && (
        <p role="status" className="flex items-center gap-2 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" />
          Thanks. Your message has been sent.
        </p>
      )}

      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send message
      </Button>
    </form>
  );
}
