import { useRef, useState } from 'react';
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useUploadAvatarAPI } from '@/libs/api';
import { cn } from '@/libs/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: number;
  src?: string;
  imageClassName?: string;
}

export function Avatar({ userId, src, className, imageClassName, children }: AvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState(src);

  const { mutate, isPending } = useUploadAvatarAPI(userId);

  const onInputClick = () => {
    inputRef.current?.click();
  };

  const onFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      mutate(file, {
        onSuccess: (data) => {
          setAvatar(data.avatar);
        },
        onError: (err) => {
          toast({
            variant: 'destructive',
            title: err.message,
          });
        },
      });
    }
  };

  return (
    <div className={cn(className, isPending && 'animate-pulse')}>
      <AvatarUI className={cn('cursor-pointer', imageClassName)} onClick={onInputClick}>
        <AvatarImage src={avatar} />
        <AvatarFallback>
          <img src="/src/assets/blocklet.svg" alt="Avatar fallback" />
        </AvatarFallback>
      </AvatarUI>
      {children}
      <input type="file" className="hidden" ref={inputRef} accept="image/x-png,image/jpeg" onChange={onFileChange} />
    </div>
  );
}
