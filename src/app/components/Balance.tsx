'use client'

import { useState, useEffect } from 'react';
import { superEcnrypt } from '@/common/crypt';
import Loading from '@/app/components/Loading'
import styles from '@/resources/balance.module.css'
import '@/app/globals.css'


interface Props {
    enable?: boolean,
    session: string
}


export default function Page(props: Props) {
    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState(true);

    const getBalance = async () => {
        try {
            const response = await fetch('/api/balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: superEcnrypt(props.session)
                })
            })
        
            if (response.ok) {
                const json = await response.json();
                setIsLoading(false);
                if (json.length > 0) {
                    if (json[0].balance) {
                        setData(json[0].balance)
                    }
                } else {
                    setData(0)
                }
            } else {
                setData(0)
            }
        } catch(e) {
            if(e) {
                setData(0)
            }
        }
    }

    useEffect(() => {
        if (props.session) {
            getBalance();
        }
        
    }, [])

    if (props.enable) {
        return (
            <div className={styles.wrap}>
                <div className = {styles.circle}>
                    <div className = {styles.label}>Balance</div>
                    <div className = {styles.number}>{data && <span>${data}</span>} {isLoading &&  <Loading size={6} />}</div> 
                </div>
            </div>
        )
    }
}