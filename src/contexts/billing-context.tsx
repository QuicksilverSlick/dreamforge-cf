/**
 * Sparks billing context — the client-side mirror of GET /api/billing/summary
 * (the org's live Spark balance, plan, and the EXPLORE catalog).
 *
 * Mirrors the LimitsProvider pattern: fetched once per login, refetched on the
 * `usage-updated` window event (fired after builds/edits complete, so the
 * header balance drains in near-real-time) and on `billing-updated` (fired
 * after a checkout/portal return).
 *
 * `data === null` covers loading/unauthenticated/self-hosted; consumers gate
 * Sparks UI on `data?.meteringEnabled` so flag-off deployments stay on the
 * legacy credits UI.
 */

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import { apiClient, type BillingSummary } from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';

interface BillingContextValue {
	data: BillingSummary | null;
	loading: boolean;
	refetch: () => void;
}

const BillingContext = createContext<BillingContextValue>({
	data: null,
	loading: false,
	refetch: () => {},
});

export function BillingProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	const [data, setData] = useState<BillingSummary | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchSummary = useCallback(async () => {
		if (!user?.id) {
			setData(null);
			return;
		}
		setLoading(true);
		try {
			const response = await apiClient.getBillingSummary();
			setData(response.data ?? null);
		} catch {
			// Billing summary is progressive enhancement — never block the app.
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	useEffect(() => {
		const handleUpdate = () => fetchSummary();
		window.addEventListener('usage-updated', handleUpdate);
		window.addEventListener('billing-updated', handleUpdate);
		return () => {
			window.removeEventListener('usage-updated', handleUpdate);
			window.removeEventListener('billing-updated', handleUpdate);
		};
	}, [fetchSummary]);

	return (
		<BillingContext.Provider value={{ data, loading, refetch: fetchSummary }}>
			{children}
		</BillingContext.Provider>
	);
}

export function useBillingContext(): BillingContextValue {
	return useContext(BillingContext);
}
