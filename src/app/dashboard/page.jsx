'use client';
import { authClient } from '@/lib/auth-client';
import React from 'react'

const page = () => {
   const userData = authClient.useSession();
   
   const user =
     userData?.data?.user ||
     userData?.data?.session?.user ||
     null;
   
   console.log("USER:", user);
  return (
    <div>
      
    </div>
  )
}

export default page
