import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar } from '@/components/avatar';
import { DobDropDown } from '@/components/dob';
import { GenderDropDown, genderLabelFromValue, genderValueFromNumber, genderValueToNumber } from '@/components/gender';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Profile, useGetProfileAPI, usePutProfileAPI } from '@/libs/api';
import { cn } from '@/libs/utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters',
  }),
  email: z.string().email({
    message: 'Email is invalid',
  }),
  phone: z
    .string()
    .regex(/^(?:(?:\+|00)86)?1\d{10}$/, {
      message: 'Phone number is invalid',
    })
    .optional(),
  gender: z.string().optional(),
  birthday: z.date().optional(),
});

interface ProfilePageProps extends React.HTMLAttributes<HTMLDivElement> {
  profile: Profile;
}

function ProfileForm({ profile }: ProfilePageProps) {
  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      gender: genderValueFromNumber(profile.gender),
      birthday: profile.birthday ? dayjs(profile.birthday).toDate() : undefined,
    },
  });

  const { isPending, mutate, reset } = usePutProfileAPI(1, { retry: false });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        username: data.username,
        email: data.email,
        phone: data.phone,
        gender: genderValueToNumber(data.gender),
        birthday: data.birthday ? dayjs(data.birthday).format('YYYY-MM-DD') : undefined,
      },
      {
        onSuccess: () => {
          reset();
          setIsEdit(false);

          toast({
            title: 'Your profile has been updated successfully',
          });
        },
        onError: (err) => {
          toast({
            variant: 'destructive',
            title: err.message,
          });
        },
      },
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <Card className="rounded-none md:rounded-xl border-none md:border shadow-none md:shadow w-full md:w-[700px] h-full md:h-auto">
          <CardHeader className="flex md:hidden">
            <CardTitle>
              <Avatar userId={1} src={profile.avatar} className="flex items-center" imageClassName="w-[32px] h-[32px]">
                <span className="pl-2">Profile</span>
              </Avatar>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Avatar
              userId={1}
              src={profile.avatar}
              className="hidden md:flex justify-center items-center p-8"
              imageClassName="w-[180px] h-[180px]"
            />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input readOnly={!isEdit} placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input readOnly={!isEdit} placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input readOnly={!isEdit} placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>Gender</FormLabel>
                      <GenderDropDown
                        onGenderChanged={(value) => {
                          form.setValue('gender', value);
                        }}>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                            disabled={!isEdit}>
                            {field.value ? genderLabelFromValue(field.value) : 'Select gender'}
                            <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </GenderDropDown>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>Date of Birthday</FormLabel>
                      <DobDropDown
                        onDateChanged={(value) => {
                          form.setValue('birthday', value);
                        }}>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="calendar"
                            className={cn('w-full', !field.value && 'text-muted-foreground')}
                            disabled={!isEdit}>
                            {field.value ? dayjs(field.value).format('YYYY-MM-DD') : <span>Pick a date</span>}
                            <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </DobDropDown>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end w-full py-4">
                  {isEdit ? (
                    <div className="flex flex-wrap-reverse justify-around w-full gap-4 md:gap-0">
                      <Button
                        className="w-full md:w-1/3"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => setIsEdit(false)}>
                        Back
                      </Button>
                      <Button type="submit" className="w-full md:w-1/3" disabled={isPending}>
                        {isPending && <Icons.loading className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full md:w-1/3" variant="outline" onClick={() => setIsEdit(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data, error, isPending } = useGetProfileAPI(1);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className=" mx-auto py-8 font-medium text-sm text-center">
          <Icons.loading />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <span className="text-red-500">Something went wrong</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ProfileForm profile={data} />;
}
