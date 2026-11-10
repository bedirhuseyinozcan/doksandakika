import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import {
  Bird,
  CloudLightning,
  Compass,
  Zap,
  Crosshair,
  Sparkles,
  Trophy,
} from 'lucide-react-native';

interface ICosmeticVectorIconProps {
  cosmeticId: string;
  size?: number;
}

export const CosmeticVectorIcon: React.FC<ICosmeticVectorIconProps> = React.memo(
  ({ cosmeticId, size = 24 }) => {
    switch (cosmeticId) {
      case 'bundle_fan_kanarya':
        // Sarı Kanarya — Lucide Bird vector in Canary Yellow
        return <Bird size={size} color="#FBBF24" strokeWidth={2.2} />;

      case 'bundle_fan_aslan':
        // Kükreyen Aslan — Regal Lion with Full Flaming Mane, Round Ears, Face Contour & Roaring Muzzle
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Outer Flaming Lion Mane (Gold) */}
            <Path
              d="M12 1.8L14.2 3.6L17.2 2.8L18 5.8L20.8 7.2L19.8 10.2L21.5 12.8L19.5 15.2L20 18.2L17 19.2L15.5 21.8L12 20.6L8.5 21.8L7 19.2L4 18.2L4.5 15.2L2.5 12.8L4.2 10.2L3.2 7.2L6 5.8L6.8 2.8L9.8 3.6L12 1.8Z"
              fill="rgba(245, 158, 11, 0.14)"
              stroke="#F59E0B"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Round Lion Ears */}
            <Path
              d="M6.8 8.2C5.8 7.2 6.2 5.6 7.5 5.4C8.4 5.3 9.1 5.8 9.4 6.5"
              stroke="#EF4444"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <Path
              d="M17.2 8.2C18.2 7.2 17.8 5.6 16.5 5.4C15.6 5.3 14.9 5.8 14.6 6.5"
              stroke="#EF4444"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            {/* Inner Lion Head & Cheek Contour */}
            <Path
              d="M6.8 8.4C6.3 12.5 7.8 16.6 12 18C16.2 16.6 17.7 12.5 17.2 8.4C15.6 6.8 13.8 6.2 12 6.2C10.2 6.2 8.4 6.8 6.8 8.4Z"
              fill="rgba(239, 68, 68, 0.16)"
              stroke="#EF4444"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            {/* Fierce Brow & Nose Bridge Lines */}
            <Path
              d="M8.5 9.8L10.6 10.6L10.9 12.6M15.5 9.8L13.4 10.6L13.1 12.6"
              stroke="#FBBF24"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Glowing Lion Eyes */}
            <Circle cx="9.2" cy="11" r="0.9" fill="#FBBF24" />
            <Circle cx="14.8" cy="11" r="0.9" fill="#FBBF24" />
            {/* Broad Feline Nose Triangle */}
            <Path
              d="M10.6 12.8H13.4L12 14.3L10.6 12.8Z"
              fill="#FBBF24"
            />
            {/* Lion Muzzle & Roaring Fangs */}
            <Path
              d="M12 14.3V15.5M9.4 15.6C10.3 16.4 11.4 16.1 12 15.4C12.6 16.1 13.7 16.4 14.6 15.6"
              stroke="#FBBF24"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'bundle_fan_kartal':
        // Kara Kartal — Smooth Bezier 24x24 Heraldic Soaring Eagle
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Feathered Spread Wings & Tail */}
            <Path
              d="M12 8.5C9.2 5.5 5.5 4 2 4.5C2.4 7.5 4 10 6.5 11.5C4.5 12.2 3.2 13.8 3.5 15.8C6 15.5 8.2 14.5 9.8 13L8.5 19.5L12 18L15.5 19.5L14.2 13C15.8 14.5 18 15.5 20.5 15.8C20.8 13.8 19.5 12.2 17.5 11.5C20 10 21.6 7.5 22 4.5C18.5 4 14.8 5.5 12 8.5Z"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Eagle Head & Hooked Beak */}
            <Path
              d="M10.8 8.2V5.8C10.8 4.5 11.5 3.8 12.5 3.8C13.5 3.8 14.2 4.5 14.5 5.4L13.2 6.2"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'bundle_fan_firtina':
        // Karadeniz Fırtınası — Lucide CloudLightning in Storm Blue
        return <CloudLightning size={size} color="#0284C7" strokeWidth={2.2} />;

      case 'bundle_fan_madrid':
        // Eflatun Krallar — Real Madrid Royal Purple (#A855F7) & Pure White (#FFFFFF) Crown
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Crown Body in Royal Purple & White */}
            <Path
              d="M11.562 4.266a.5.5 0 0 1 .876 0L15.39 9.87a1 1 0 0 0 1.516.294L21.183 6.5a.5.5 0 0 1 .798.519l-2.834 9.746a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 7.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
              fill="rgba(168, 85, 247, 0.25)"
              stroke="#A855F7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* White Royal Base Band & Jewels */}
            <Path
              d="M5 20.5H19"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <Circle cx="12" cy="3" r="1.2" fill="#FFFFFF" />
            <Circle cx="3" cy="5.5" r="1.1" fill="#FFFFFF" />
            <Circle cx="21" cy="5.5" r="1.1" fill="#FFFFFF" />
          </Svg>
        );

      case 'avatar_keeper':
        // Panter Kaleci — Goalkeeper Glove (Kaleci Eldiveni) in Neon Green (#00D084)
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Padded Goalkeeper Glove Fingers & Thumb Silhouette */}
            <Path
              d="M7.2 18V12.2L5.2 10.5C4.2 9.6 2.8 9.8 2.3 10.8C1.8 11.7 2.1 12.9 3 13.6L6.8 17.2M7.2 12.2V5.5C7.2 4.6 7.9 3.9 8.8 3.9C9.7 3.9 10.4 4.6 10.4 5.5V9.8M10.4 5.2V3.6C10.4 2.7 11.1 2 12 2C12.9 2 13.6 2.7 13.6 3.6V9.8M13.6 5.5C13.6 4.6 14.3 3.9 15.2 3.9C16.1 3.9 16.8 4.6 16.8 5.5V10.8M16.8 7.5C16.8 6.7 17.4 6 18.2 6C19 6 19.7 6.7 19.7 7.5V13.8C19.7 15.8 18.5 17.2 17.2 18"
              fill="rgba(0, 208, 132, 0.14)"
              stroke="#00D084"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Latex Palm Grip Cushion Line */}
            <Path
              d="M9.5 13.8C10.8 12.6 13.8 12.6 15.2 14"
              stroke="#00D084"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Goalkeeper Wrist Strap Cuff */}
            <Path
              d="M6.8 18H17.4V20.8C17.4 21.5 16.9 22 16.2 22H8C7.3 22 6.8 21.5 6.8 20.8V18Z"
              fill="rgba(0, 208, 132, 0.22)"
              stroke="#00D084"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <Path
              d="M10.2 20H14"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'avatar_winger':
        return <Zap size={size} color="#F59E0B" strokeWidth={2.3} />;

      case 'avatar_striker':
        return <Crosshair size={size} color="#EF4444" strokeWidth={2.3} />;

      case 'bundle_ucl_star':
        return <Sparkles size={size} color="#3478F6" strokeWidth={2.3} />;

      case 'bundle_ballon_dor_legend':
        return <Trophy size={size} color="#EAB308" strokeWidth={2.3} />;

      case 'avatar_default':
      default:
        return <Compass size={size} color="#C7FB07" strokeWidth={2.3} />;
    }
  }
);

CosmeticVectorIcon.displayName = 'CosmeticVectorIcon';

interface ITeamCrestBadgeIconProps {
  primaryColor: string;
  secondaryColor?: string;
  size?: number;
}

/**
 * Dual-color split mini vector shield replacing emoji balls (🟡🔵, 🟡🔴, etc.)
 */
export const TeamCrestBadgeIcon: React.FC<ITeamCrestBadgeIconProps> = React.memo(
  ({ primaryColor, secondaryColor, size = 13 }) => {
    const rightColor = secondaryColor || primaryColor;
    return (
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <G>
          <Path
            d="M8 1L14.5 3.5V8.2C14.5 11.9 11.7 14.2 8 15C4.3 14.2 1.5 11.9 1.5 8.2V3.5L8 1Z"
            fill={primaryColor}
          />
          <Path
            d="M8 1L14.5 3.5V8.2C14.5 11.9 11.7 14.2 8 15V1Z"
            fill={rightColor}
          />
          <Path
            d="M8 1L14.5 3.5V8.2C14.5 11.9 11.7 14.2 8 15C4.3 14.2 1.5 11.9 1.5 8.2V3.5L8 1Z"
            stroke="#FFFFFF"
            strokeOpacity={0.65}
            strokeWidth="1.1"
          />
        </G>
      </Svg>
    );
  }
);

TeamCrestBadgeIcon.displayName = 'TeamCrestBadgeIcon';
