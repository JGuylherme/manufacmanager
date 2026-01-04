'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    children: React.ReactNode;
    fallback?: string;
}

export default function ProtectedRoute({ children, fallback = "/login" }: Props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace(fallback);
        } else {
            setAuthorized(true);
        }
    }, [router, fallback]);

    if (!authorized) return null;

    return <>{children}</>;
}