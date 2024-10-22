'use client';

import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
    href: string;
    label: string;
    icon: any;
    active?: boolean;
    onClick?: () => void;
    }

const MobileItems:React.FC<MobileItemProps> = ({
    href,
    label,
    icon:Icon,
    active,
    onClick
}) => {
    const handleClick = () => {
        if (onClick) {
          return onClick();
        }
      };

  return (
    <Link href={href} onClick={onClick} className={clsx(`group flex gap-x-3 text-sm leading-6 font-semibold w-full
    justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
    active && `text-black bg-gray-100`
    )}>
        <Icon className="h-6 w-6"/>
    </Link>
  )
}

export default MobileItems