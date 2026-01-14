'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CONTEXT_OPTIONS, STYLE_OPTIONS } from '@/lib/constants';
import type { UserPreferences } from '@/lib/types';
import { Shirt } from 'lucide-react';

const onboardingSchema = z.object({
  style: z.enum(['male', 'female'], {
    required_error: '請選擇一種風格偏好',
  }),
  contexts: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: '您至少需要選擇一個日常情境',
  }),
});

interface OnboardingProps {
  onSave: (preferences: UserPreferences) => void;
}

export default function Onboarding({ onSave }: OnboardingProps) {
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      style: 'female',
      contexts: ['daily-commute', 'weekend-outing'],
    },
  });

  function onSubmit(data: z.infer<typeof onboardingSchema>) {
    onSave(data as UserPreferences);
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 text-primary rounded-full p-3 w-fit mb-4">
             <Shirt className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl">歡迎來到 Stylecast</CardTitle>
          <CardDescription className="text-base">只需幾個步驟，即可為您量身打造個人化的穿搭建議。</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold">1. 選擇您的穿搭風格</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {STYLE_OPTIONS.map((option) => (
                          <FormItem key={option.id}>
                            <FormControl>
                              <RadioGroupItem value={option.id} className="sr-only" />
                            </FormControl>
                            <FormLabel
                                className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors ${field.value === option.id ? 'border-primary' : ''}`}
                            >
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contexts"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-lg font-semibold">2. 選擇您常見的日常情境</FormLabel>
                      <FormDescription>您可以選擇多個選項。</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CONTEXT_OPTIONS.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="contexts"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6">開始使用</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
