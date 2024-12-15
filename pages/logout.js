import { useRouter } from 'next/router'
import {useEffect} from 'react'

export default function Dashboard() {


    const router = useRouter()

    useEffect(() => {

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/')


    },[])


}