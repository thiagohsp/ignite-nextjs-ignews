import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { stripe } from '../../services/stripe';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    const router = useRouter();

    if (session.activeSubscription) {
      return router.push('/posts')
    }

    try {
      const response = await api.post('subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      stripe.redirectToCheckout({ sessionId })

    } catch (err) {
      alert(err.message)
    }

  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}