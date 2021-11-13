# ens-claim
This package provides React hooks and components helpful in notifying users of products that they have unclaimed $ENS tokens from the ENS DAO airdrop, and directing them to claim those tokens.

## Installation
`npm install --save @metaphor-xyz/ens-claim`

or

`yarn save @metaphor-xyz/ens-claim`

## Usage

### ENSClaimButton
The `ENSClaimButton` renders a button, if and only if the user's wallet as an open $ENS claim available, that when clicked shows a modal explaining how to claim the tokens.

```tsx
import { BaseProvider } from 'ethers';
import { ENSClaimButton } from '@metaphor-xyz/ens-claim';

function SomeComponent({ address, provider }: { address: string, provider: BaseProvider }) {
  return <ENSClaimButton
    address={address}
    provider={provider} // optional
    delegate='metaphor.xyz' // optional, ENS name for default delegate
  />;
}
```

![Claim ENS button](/images/button.png)
![Claim ENS modal](/images/modal.png)

### useENSClaim
If you would like to create your own button, the `useENSClaim` hook tells you whether or not an address has ENS tokens to claim.

```tsx
function SomeComponent() {
  const { hasClaim } = useENSClaim();

  if (!hasClaim) {
    return null;
  }

  // ... render notification
}
```

## License
MIT

## TODO
There are a few possible improvements for the library:

- Show the user their $ENS claim balance. This is very easy to do, but not sure if it's a good idea or not.
- Perform the claim in-place for the user. This wouldn't be very responsible to do without also implementing the Snapshot voting for constitution ratification, until that process is over at least.

