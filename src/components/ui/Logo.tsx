import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 relative">
        <Image
          src="/airplane.png"
          alt="Rate my DPE Logo"
          width={32}
          height={32}
          className="object-contain dark:invert"
        />
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        Rate my DPE
      </span>
    </Link>
  );
} 