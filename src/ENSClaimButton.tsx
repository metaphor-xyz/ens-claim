import useENSClaim from "./useENSClaim";
import {
  BaseProvider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers";
import React, { CSSProperties, useCallback, useState } from "react";
import ReactDOM from "react-dom";

const fontFamily =
  '"JakartaSans",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif';

const buttonStyles: Record<string, CSSProperties> = {
  button: {
    background:
      "linear-gradient(330.4deg, rgb(68, 188, 240) 4.54%, rgb(114, 152, 248) 59.2%, rgb(160, 153, 255) 148.85%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "rgb(0 0 0 / 4%) 0px 2px 12px",
    borderRadius: "12px",
    color: "#fff",
    padding: "7px 8px",
    fontFamily,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center",
    letterSpacing: "-0.01em",
    transition: "all 0.2s ease-out 0s",
    cursor: "pointer",
    pointerEvents: "initial",
    userSelect: "none",
    borderWidth: 0,
  },
  big: {
    fontSize: "18px",
    padding: "14px 16px",
  },
  hover: {
    transform: "translateY(-1px)",
    filter: "brightness(1.05)",
  },
};

function Button({
  label,
  onClick,
  size,
}: {
  label: string;
  onClick: () => void;
  size?: "small" | "big";
}) {
  const [hover, setHover] = useState(false);

  const onMouseOver = useCallback(() => setHover(true), []);
  const onMouseOut = useCallback(() => setHover(false), []);

  return (
    <button
      style={{
        ...buttonStyles.button,
        ...(hover ? buttonStyles.hover : {}),
        ...(size === "big" ? buttonStyles.big : {}),
      }}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {label}
    </button>
  );
}

const modalStyles: Record<string, CSSProperties> = {
  container: {
    display: "none",
    position: "fixed",
    zIndex: 1,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    backgroundColor: "#fefefe",
    margin: "15% auto",
    padding: "20px",
    border: "1px solid #888",
    width: "80%",
    maxWidth: "400px",
    borderRadius: "8px",
  },
  title: {
    fontFamily,
    fontSize: "24px",
    fontWeight: 600,
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontFamily,
    fontSize: "18px",
    padding: "4px 24px",
  },
};

export interface ClaimModalProps {
  open: boolean;
  onClose?: () => void;
  delegate?: string;
}

export function ClaimModal({ open, onClose, delegate }: ClaimModalProps) {
  const triggerClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const goToClaim = useCallback(() => {
    window.open(
      `https://claim.ens.domains${delegate ? `?delegate=${delegate}` : ""}`
    );
  }, [delegate]);

  const captureClick = useCallback(
    (e: React.SyntheticEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    []
  );

  const containerStyle = {
    ...modalStyles.container,
    display: open ? "block" : "none",
  };

  return ReactDOM.createPortal(
    <div style={containerStyle} onClick={triggerClose}>
      <div style={modalStyles.content} onClick={captureClick}>
        <h3 style={modalStyles.title}>You can claim some $ENS</h3>
        <p style={modalStyles.description}>
          Ethereum Name Service has dropped you some $ENS tokens for owning one
          or more ENS names.
        </p>
        <p style={modalStyles.description}>
          These tokens are used to govern the ENS DAO, which governs the
          protocol and a treasury intended to support the continued development
          of the protocol.
        </p>
        <div style={modalStyles.buttonContainer}>
          <Button label="Learn More" size="big" onClick={goToClaim} />
        </div>
        {delegate && (
          <p style={modalStyles.description}>
            We would love if you claimed and delegated your tokens' voting power
            to <strong>{delegate}</strong> (or any of the other delegates listed
            in the official claim app)
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}

export interface ENSClaimButtonProps {
  address: string;
  provider?: BaseProvider | ExternalProvider | JsonRpcFetchFunc;
  delegate?: string;
}

export default function ENSClaimButton({
  address,
  provider,
  delegate,
}: ENSClaimButtonProps) {
  const { hasClaimed } = useENSClaim(address, provider);
  const [claimOpen, setClaimOpen] = useState(false);

  const openClaimModal = useCallback(() => setClaimOpen(true), []);
  const closeClaimModal = useCallback(() => setClaimOpen(false), []);

  if (hasClaimed !== false) {
    return null;
  }

  return (
    <>
      <Button label="Claim your $ENS" onClick={openClaimModal} />
      <ClaimModal
        open={claimOpen}
        onClose={closeClaimModal}
        delegate={delegate}
      />
    </>
  );
}
