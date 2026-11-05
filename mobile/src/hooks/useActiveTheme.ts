import { useMemo } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { getCosmeticById } from '../features/shop/catalog';
import { Colors } from '../theme/colors';
import { IThemeConfig, ICosmeticItem } from '../features/shop/types';

export interface IActiveThemeResult {
  cosmetic: ICosmeticItem;
  theme: IThemeConfig;
  primaryColor: string;
  secondaryColor: string;
  cardBorder: string;
  accentGlow: string;
  headerGlow: string;
  isLightPrimary: boolean;
  onPrimaryTextColor: string;
}

export function useActiveTheme(): IActiveThemeResult {
  const equippedCosmeticId = useGameStore((s) => s.equippedCosmeticId);

  return useMemo(() => {
    const cosmetic = getCosmeticById(equippedCosmeticId);
    const theme = cosmetic.themeConfig;
    const primaryColor = theme.primaryColor || Colors.accentPrimary;
    const secondaryColor = theme.secondaryColor || Colors.primaryBlack;
    const cardBorder = theme.cardBorder || Colors.border;
    const accentGlow = theme.accentGlow || 'rgba(0, 208, 132, 0.08)';
    const headerGlow = theme.headerGlow || primaryColor;

    const isLightPrimary =
      primaryColor === '#FBBF24' ||
      primaryColor === '#FFFFFF' ||
      primaryColor === '#F4F4F5' ||
      primaryColor === '#EAB308' ||
      primaryColor === '#00D084' ||
      primaryColor === '#C7FB07';

    const onPrimaryTextColor = isLightPrimary ? '#090909' : '#FFFFFF';

    return {
      cosmetic,
      theme,
      primaryColor,
      secondaryColor,
      cardBorder,
      accentGlow,
      headerGlow,
      isLightPrimary,
      onPrimaryTextColor,
    };
  }, [equippedCosmeticId]);
}
