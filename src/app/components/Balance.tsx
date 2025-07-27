'use client';

import { useState, useEffect } from 'react';
import { superEcnrypt } from '@/common/crypt';
import Loading from '@/app/components/Loading';
import {readCookie, deleteCookie } from '@/common/cookieServer';
import styles from '@/resources/balance.module.css';

interface Props {
  enable?: boolean;
  session: string;
}

interface BalanceResponse {
  balance: number;
}

export default function Page({ enable = true, session }: Props) {
    const [balance, setBalance] = useState<number|undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [className, setClassName] = useState<string|null>()

    const fetchBalance = async(startBalance?:number) => {
        try {
            const response = await fetch('/api/balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: superEcnrypt(session) }),
            });
            
            const json: BalanceResponse[] = await response.json();
            
            if (response.ok && Array.isArray(json) && json.length > 0) {
                if (startBalance) {
                    if (startBalance < json[0].balance) {
                        animatePosBalance(Number(startBalance), json[0].balance)
                    } else {
                        animateNegBalance(Number(startBalance), json[0].balance)
                    }
                } else {
                    setBalance(json[0].balance)
                }
            } else {
                setBalance(0);
            }
        } catch {
            setBalance(0);
        } finally {
            setIsLoading(false);
        }
    }

    const getBalance = async() => {
        const cookieBalance = await readCookie('balance');
        if (cookieBalance) {
            fetchBalance(Number(cookieBalance));
        } else {
           fetchBalance();
        }
    };

    const animateNegBalance = async (startBalance:number, endBalance: number) => {
        let newBalance = Number(startBalance)
        setBalance(newBalance);
        setClassName('neg');

        const balinterval = setInterval(() => {
            if ((newBalance - 50) > endBalance) {
                newBalance -= 50;
                setBalance(newBalance);
            } else {
                setBalance(endBalance);
                clearInterval(balinterval);
                setClassName('')
                deleteCookie('balance')
            }
        }, 100);
    }

    const animatePosBalance = async (startBalance:number, endBalance: number) => {
        let newBalance = Number(startBalance)
        setBalance(newBalance);
        setClassName('pos');

        const balinterval = setInterval(() => {
            if ((newBalance + 50) < endBalance) {
                newBalance += 50;
                setBalance(newBalance);
            } else {
                setBalance(endBalance);
                clearInterval(balinterval);
                setClassName('')
                deleteCookie('balance')
            }
        }, 100);
    }

    useEffect(() => {
        getBalance();
    }, [session]);

    if (!enable) return null;

    const getClassName = () => {
        let classstr = styles.circle;
        if (className == 'neg') {
            classstr = classstr + ' ' + styles.neg
        } 

        if (className == 'pos') {
            classstr = classstr + ' ' + styles.pos
        }
        return classstr;
    }

    const testing = "<div className={`${styles.circle} ${ className === 'neg'? 'bg-red-300'  : className === 'pos'? 'bg-black': 'bg-green-200' }`}>"

    return (
        <div id = "balance" className={className? styles.wrap + ' ' + className : styles.wrap}>
            <div className = {getClassName()} >
                {isLoading ? (
                <span className="relative size-30 left-3 top-3">
                    <Loading />
                </span>
                ) : (
                <>
                    <div className={styles.label}>Balance</div>
                    <div className={styles.number}>
                    <span className = "min-h-[34px]">{balance && <span>${(balance).toFixed(2)}</span>}</span>
                    </div>
                </>
                )}
            </div>
        </div>
    );
}