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
    const [data, setData] = useState<string>()
    const [isLoading, setIsLoading] = useState(true);

    const animateBalance = (amount:number) => {
        console.log(amount);
        let newamount = 0
        setData('0.00')
        const balint = setInterval(() => {
            if ((newamount + 100) < amount) {
                newamount = newamount+100
                setData(newamount.toString())
            } else {
                setData(amount.toString())
                clearInterval(balint);
            }
      
        },50)
         setData(amount.toString())
    }

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
                        animateBalance(json[0].balance)
                    }
                } else {
                    setData('0')
                }
            } else {
                setIsLoading(false)
                setData('0')
            }
        } catch(e) {
            if(e) {
                setIsLoading(false);
                setData('0')
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
                    <div className = {styles.number}>{data && <span>${data}</span>} 
                    <span className = "relative left-13">{isLoading &&  <Loading size={6} />}</span>
                    </div> 
                </div>
            </div>
        )
    }
}