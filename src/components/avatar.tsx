import Image from 'next/image';

interface AvatarProps {
  id: string;
  alt: string;
}

export function Avatar({ id, alt }: AvatarProps) {
  return <Image src={`/${id}.svg`} alt={alt} width='64' height='64' />;
}

export function AvatarOfMe() {
  return <Avatar id='me' alt='A portrait of me' />;
}
