import { InterestRate } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import { useModalContext } from 'src/hooks/useModal';

import { ListColumn } from '../../../../components/lists/ListColumn';
import { ComputedUserReserveData } from '../../../../hooks/app-data-provider/useAppDataProvider';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemAPYButton } from '../ListItemAPYButton';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';

export const BorrowedPositionsListItem = ({
  reserve,
  totalBorrows,
  totalBorrowsUSD,
  borrowRateMode,
  stableBorrowAPY,
}: ComputedUserReserveData & { borrowRateMode: InterestRate }) => {
  const { openBorrow, openRepay, openRateSwitch } = useModalContext();
  const {
    isActive,
    isFrozen,
    borrowingEnabled,
    stableBorrowRateEnabled,
    sIncentivesData,
    vIncentivesData,
    variableBorrowAPY,
  } = reserve;

  return (
    <ListItemWrapper
      symbol={reserve.symbol}
      iconSymbol={reserve.iconSymbol}
      data-cy={`dashboardBorrowedListItem_${reserve.symbol.toUpperCase()}_${borrowRateMode}`}
    >
      <ListValueColumn
        symbol={reserve.symbol}
        value={Number(totalBorrows)}
        subValue={Number(totalBorrowsUSD)}
        disabled={Number(totalBorrows) === 0}
      />

      <ListAPRColumn
        value={Number(
          borrowRateMode === InterestRate.Variable ? variableBorrowAPY : stableBorrowAPY
        )}
        incentives={borrowRateMode === InterestRate.Variable ? vIncentivesData : sIncentivesData}
        symbol={reserve.symbol}
      />

      <ListColumn>
        <ListItemAPYButton
          stableBorrowRateEnabled={stableBorrowRateEnabled}
          borrowRateMode={borrowRateMode}
          disabled={!stableBorrowRateEnabled || isFrozen || !isActive}
          onClick={() => openRateSwitch(reserve.underlyingAsset)}
          stableBorrowAPY={reserve.stableBorrowAPY}
          variableBorrowAPY={reserve.variableBorrowAPY}
          underlyingAsset={reserve.underlyingAsset}
        />
      </ListColumn>

      <ListButtonsColumn>
        <Button
          disabled={!isActive}
          variant="contained"
          onClick={() => openRepay(reserve.underlyingAsset)}
        >
          <Trans>Repay</Trans>
        </Button>
        <Button
          disabled={!isActive || !borrowingEnabled || isFrozen}
          variant="outlined"
          onClick={() => openBorrow(reserve.underlyingAsset)}
        >
          <Trans>Borrow</Trans>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};