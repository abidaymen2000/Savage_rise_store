"use client"
import {useRouter} from 'next/navigation'
export function useHeroNavigation(){const router=useRouter();return {href:(path:string)=>path,push:(path:string)=>router.push(path)}}
