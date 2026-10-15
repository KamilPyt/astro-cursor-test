import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { supabase } from '../lib/supabase';

export default function Auth() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loadingAction, setLoadingAction] = useState<'signin' | 'signup' | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const loading = loadingAction !== null;

	const handleSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoadingAction('signin');
		setError(null);
		setSuccess(null);

		try {
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (signInError) {
				setError(signInError.message);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Nie udało się zalogować.');
		} finally {
			setLoadingAction(null);
		}
	};

	const handleSignUp = async () => {
		setLoadingAction('signup');
		setError(null);
		setSuccess(null);

		try {
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
			});

			if (signUpError) {
				setError(signUpError.message);
				return;
			}

			if (data.user?.identities && data.user.identities.length === 0) {
				setError('Konto z tym adresem email już istnieje.');
				return;
			}

			setSuccess('Konto zostało utworzone! Możesz się teraz zalogować.');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Nie udało się zarejestrować.');
		} finally {
			setLoadingAction(null);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			class="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur"
		>
			<div class="mb-8">
				<p class="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
					Konto
				</p>
				<h1 class="mt-2 text-2xl font-semibold text-zinc-50">Zaloguj się</h1>
				<p class="mt-2 text-sm text-zinc-400">
					Wpisz email i hasło, aby kontynuować.
				</p>
			</div>

			<div class="space-y-4">
				<label class="block">
					<span class="mb-2 block text-sm font-medium text-zinc-300">Email</span>
					<input
						type="email"
						name="email"
						autocomplete="email"
						required
						value={email}
						disabled={loading}
						placeholder="jan@example.com"
						onInput={(event) => setEmail(event.currentTarget.value)}
						class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-60"
					/>
				</label>

				<label class="block">
					<span class="mb-2 block text-sm font-medium text-zinc-300">Hasło</span>
					<input
						type="password"
						name="password"
						autocomplete="current-password"
						required
						minLength={6}
						value={password}
						disabled={loading}
						placeholder="••••••••"
						onInput={(event) => setPassword(event.currentTarget.value)}
						class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-60"
					/>
				</label>
			</div>

			{error && (
				<p
					role="alert"
					class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
				>
					{error}
				</p>
			)}

			{success && (
				<p
					role="status"
					class="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-300"
				>
					{success}
				</p>
			)}

			<button
				type="submit"
				disabled={loading}
				class="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{loadingAction === 'signin' ? 'Logowanie…' : 'Zaloguj się'}
			</button>

			<button
				type="button"
				disabled={loading}
				onClick={handleSignUp}
				class="mt-3 w-full rounded-xl border border-zinc-600 bg-transparent px-4 py-3 font-semibold text-zinc-200 transition hover:border-zinc-400 hover:bg-zinc-800/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{loadingAction === 'signup' ? 'Rejestracja…' : 'Zarejestruj się'}
			</button>
		</form>
	);
}
