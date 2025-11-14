# AI Riddler

Small Next.js app that delivers short riddles and lets connected wallet users submit answers.

Key features

- Wallet-connect gated "Get Riddle" button (uses AppKit integrations).
- Fetches riddles from a webhook and displays the riddle text.
- Users submit answers; app POSTs the answer along with Riddle_ID and wallet address to a webhook and shows the result (status + correct answer).

Deploy / Demo

- This project uses Next.js and can be deployed to Vercel or any Node host that supports Next 14.

Local development

1. Install dependencies (pnpm is recommended — this repo includes a pnpm lockfile):

```bash
pnpm install
```

2. Run the dev server:

```bash
pnpm dev
```

3. Open http://localhost:3000

Important files and behavior

- `app/page.tsx` — main UI. The "Get Riddle" button calls the webhook at `/webhook-test/getRiddle` and requires a connected wallet (the hook `useAppKitAccount` is used to check `isConnected` and read `address`).
- On successful fetch the app extracts `data[0].Riddle_Text` and `Riddle_ID` from the webhook response and displays the riddle text.
- The answer textbox + Submit button POSTs JSON to `/webhook-test/submitRiddle` with the shape:

```json
{
  "Riddle_ID": "RID-...",
  "Riddle_Text": "...",
  "userAnswer": "...",
  "userWallet": "0x..."
}
```

- The app expects responses that include `Pass` / `Status` and `Correct_Answer` inside `data[0]` (see `submitAnswer` in `app/page.tsx`); it then displays the returned status and correct answer.

Notes

- If you see TypeScript errors about `useAppKitAccount` imports, try switching the import path between `@reown/appkit/react` and `@reown/appkit/controllers/react` depending on your installed package version — one of them exports the hook in the bundled build.
- The webhook endpoints in the code point to `https://abelosaretin.name.ng/webhook-test/*`. Change these URLs in `app/page.tsx` if you want to target a different server.

Contributing

- Open a branch, make changes, and open a PR against `main`.

License

- MIT
