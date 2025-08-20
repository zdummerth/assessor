"use client";

import dynamic from "next/dynamic";
const CompMap = dynamic(() => import("@/components/ui/maps/comps"), {
  ssr: false,
});

type Props = React.ComponentProps<typeof CompMap>;

export default function CompsMapClientWrapper(props: Props) {
  return <CompMap {...props} />;
}
