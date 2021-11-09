import React, { useEffect, useState } from "react";
import useInterval from "@use-it/interval";
import { useHistory } from "@chainsafe/common-components";
import { makeStyles, createStyles } from "@chainsafe/common-theme";
import { useExplorer } from "../../Contexts/ExplorerContext";
import TransferDetailView from "../Custom/TransferDetailView";
import { fetchTransaction } from "../../Services/ExplorerService";
import { computeTransferDetails } from "../../Utils/Helpers";
import {
  DepositRecord,
  TransferDetails,
} from "../../Contexts/Reducers/TransfersReducer";

const useStyles = makeStyles(() =>
  createStyles({
    transferDetailViewContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
  })
);

const TransactionPage = () => {
  const {
    __RUNTIME_CONFIG__: {
      UI: { transactionAutoUpdateInterval },
    },
  } = window;
  const { redirect } = useHistory();
  const classes = useStyles();
  const explorerContext = useExplorer();
  const {
    explorerState: { chains },
  } = explorerContext;
  const [transaction, setTransaction] = useState<DepositRecord | undefined>();
  const [delay, setDelay] = useState<null | number>(
    transactionAutoUpdateInterval ?? 5000
  );
  const [
    transferDetailed,
    setTransferDetailed,
  ] = useState<TransferDetails | null>(null);
  const urlSplited = window.location.pathname.split("/");
  const txHash = urlSplited[urlSplited.length - 1];
  useEffect(() => {
    fetchTransaction(txHash, setTransaction);
  }, []);

  useInterval(() => {
    fetchTransaction(txHash, setTransaction);
    console.log("This will run every", transactionAutoUpdateInterval);
    console.log(transaction);
    if (transaction && (transaction.status === 3 || transaction.status === 4)) {
      console.log("transaction status", transaction.status);
      console.log("stopping requests");
      setDelay(null);
    }
  }, delay);

  useEffect(() => {
    if (transaction && Object.keys(transaction).length) {
      const txDetail = computeTransferDetails(
        transaction as DepositRecord,
        chains
      );
      setTransferDetailed(txDetail);
    }
  }, [transaction]);

  return (
    <div className={classes.transferDetailViewContainer}>
      {transferDetailed && (
        <TransferDetailView transferDetails={transferDetailed!} />
      )}
    </div>
  );
};

export default TransactionPage;