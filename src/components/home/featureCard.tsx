import React from "react";
import { Card } from "../ui/card";
import Link from "next/link";

const FeatureCard = ({ label, href }: { label: string; href: string }) => {
  return (
    <Link href={href} className="no-underline">
      <Card className="flex items-center justify-center bg-green-400 hover:bg-green-400/80 text-white font-bold w-[100px] h-[100px]">
        {label}
      </Card>
    </Link>
  );
};

export default FeatureCard;
