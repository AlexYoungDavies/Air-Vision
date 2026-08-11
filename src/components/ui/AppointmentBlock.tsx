import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import FormatListBulletedOutlined from '@mui/icons-material/FormatListBulletedOutlined';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import { CircleCheckIcon } from '../icons';
import { getAppointmentTypeVisual } from '../../data/mockAppointmentTypes';
import {
  formatAppointmentTimeRange,
  type CalendarAppointmentAlerts,
  type CalendarAppointmentStatus,
} from '../../data/mockCalendarAppointments';

export type AppointmentBlockDensity = 'default' | 'narrow' | 'thin' | 'thinNarrow';

export interface AppointmentBlockProps {
  patientName: string;
  caseName: string;
  appointmentType: string;
  facilityName: string;
  status: CalendarAppointmentStatus;
  startMinutes: number;
  endMinutes: number;
  alerts?: CalendarAppointmentAlerts;
  active?: boolean;
  onClick?: () => void;
  /** Force a density; otherwise inferred from height via CSS + duration hint */
  density?: AppointmentBlockDensity;
  /** Duration-based height hint for thin layouts (minutes) */
  durationMinutes?: number;
  sx?: SxProps<Theme>;
}

function getNoShowHatch(color: string) {
  return `repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    ${color} 3px,
    ${color} 4px
  )`;
}

function statusShellSx(
  status: CalendarAppointmentStatus,
  active: boolean,
): SxProps<Theme> {
  if (active) {
    return {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      border: '1px solid',
      borderColor: 'primary.main',
      ...(status === 'checkedIn' || status === 'canceled' || status === 'noShow'
        ? {
            borderLeftWidth: 3,
            borderLeftColor:
              status === 'canceled' || status === 'noShow' ? 'error.light' : 'primary.dark',
          }
        : {}),
      ...(status === 'noShow'
        ? {
            backgroundImage: (theme) =>
              getNoShowHatch(
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)',
              ),
          }
        : {}),
    };
  }

  switch (status) {
    case 'scheduled':
      return {
        bgcolor: 'background.paper',
        color: 'primary.main',
        border: '1px dashed',
        borderColor: 'primary.main',
      };
    case 'confirmed':
      return {
        bgcolor: 'background.paper',
        color: 'primary.main',
        border: '1px solid',
        borderColor: 'primary.main',
      };
    case 'checkedIn':
      return {
        bgcolor: 'primary.light',
        color: 'primary.dark',
        border: '1px solid',
        borderColor: 'primary.main',
        borderLeftWidth: 3,
        borderLeftColor: 'primary.dark',
      };
    case 'completed':
      return {
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        color: 'text.disabled',
        border: '1px solid',
        borderColor: 'divider',
      };
    case 'canceled':
      return {
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        color: 'text.secondary',
        border: '1px solid',
        borderColor: 'divider',
        borderLeftWidth: 3,
        borderLeftColor: 'error.main',
      };
    case 'noShow':
      return {
        bgcolor: 'primary.light',
        color: 'primary.dark',
        border: '1px solid',
        borderColor: 'primary.main',
        borderLeftWidth: 3,
        borderLeftColor: 'error.main',
        backgroundImage: (theme) =>
          getNoShowHatch(
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          ),
      };
    default:
      return {};
  }
}

function StatusAlertLabel({
  status,
  active,
  compact,
}: {
  status: CalendarAppointmentStatus;
  active: boolean;
  compact?: boolean;
}) {
  if (status !== 'canceled' && status !== 'noShow') return null;
  const full = status === 'canceled' ? 'CANCELED' : 'NO SHOW';
  const short = status === 'canceled' ? 'CNLD' : 'NS';
  return (
    <Typography
      component="span"
      sx={{
        fontSize: 10,
        fontWeight: 700,
        lineHeight: '14px',
        letterSpacing: '0.02em',
        color: active ? 'inherit' : 'error.main',
        flexShrink: 0,
      }}
    >
      {compact ? short : full}
    </Typography>
  );
}

function AlertIcons({
  alerts,
  active,
  status,
}: {
  alerts?: CalendarAppointmentAlerts;
  active: boolean;
  status: CalendarAppointmentStatus;
}) {
  if (!alerts) return null;
  const iconColor =
    status === 'completed' && !active
      ? 'text.disabled'
      : active
        ? 'inherit'
        : 'primary.main';
  const billingColor = active ? 'inherit' : 'error.main';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '1px',
        flexShrink: 0,
        pr: '3px',
        pb: '3px',
        color: iconColor,
      }}
    >
      {alerts.hasChecklist && <CircleCheckIcon sx={{ fontSize: 14 }} />}
      {alerts.hasBillingIssue && (
        <AttachMoneyOutlined sx={{ fontSize: 14, color: billingColor }} />
      )}
      {alerts.hasNotes && <FormatListBulletedOutlined sx={{ fontSize: 14 }} />}
      {alerts.extraCount != null && alerts.extraCount > 0 && (
        <Typography
          component="span"
          sx={{ fontSize: 10, fontWeight: 600, lineHeight: '14px', ml: '1px' }}
        >
          +{alerts.extraCount}
        </Typography>
      )}
    </Box>
  );
}

/** Calendar appointment block — status + density variants per design system. */
export function AppointmentBlock({
  patientName,
  caseName,
  appointmentType,
  facilityName,
  status,
  startMinutes,
  endMinutes,
  alerts,
  active = false,
  onClick,
  density: densityProp,
  durationMinutes,
  sx,
}: AppointmentBlockProps) {
  const [hovered, setHovered] = useState(false);
  const duration = durationMinutes ?? endMinutes - startMinutes;
  const inferredThin = duration <= 30;
  const density = densityProp ?? (inferredThin ? 'thin' : 'default');
  const isThin = density === 'thin' || density === 'thinNarrow';
  const isNarrow = density === 'narrow' || density === 'thinNarrow';
  const strike = status === 'canceled';
  const showCheck = status === 'checkedIn';
  const timeLabel = formatAppointmentTimeRange(startMinutes, endMinutes);
  const isInteractive = Boolean(onClick);
  const typeVisual = getAppointmentTypeVisual(appointmentType);

  return (
    <Box
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={[
        {
          containerType: 'inline-size',
          containerName: 'appt-block',
          minWidth: 80,
          height: '100%',
          boxSizing: 'border-box',
          borderRadius: '4px',
          overflow: 'hidden',
          cursor: isInteractive ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          pt: '1px',
          pb: '1px',
          pl: '8px',
          pr: 0,
          transition: 'box-shadow 120ms ease, filter 120ms ease',
          ...(hovered && !active
            ? {
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 1px 4px rgba(0,0,0,0.45)'
                    : '0 1px 4px rgba(0,0,0,0.12)',
                filter: 'brightness(0.98)',
              }
            : {}),
        },
        statusShellSx(status, active),
        {
          borderLeftWidth: 3,
          borderLeftStyle: 'solid',
          borderLeftColor: active ? undefined : typeVisual.accent,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Thin / thin+narrow — single row */}
      {isThin ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minHeight: 0,
            flex: 1,
            pr: '4px',
            overflow: 'hidden',
          }}
        >
          {showCheck && (
            <CheckOutlined sx={{ fontSize: 12, flexShrink: 0, color: 'inherit' }} />
          )}
          <Typography
            sx={{
              fontSize: 12,
              lineHeight: '16px',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: 1,
              textDecoration: strike ? 'line-through' : 'none',
            }}
          >
            {patientName}
          </Typography>
          {status === 'canceled' || status === 'noShow' ? (
            <StatusAlertLabel status={status} active={active} compact={isNarrow} />
          ) : (
            !isNarrow && <AlertIcons alerts={alerts} active={active} status={status} />
          )}
          {isNarrow && status !== 'canceled' && status !== 'noShow' && alerts?.extraCount ? (
            <Typography sx={{ fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
              +{alerts.extraCount}
            </Typography>
          ) : null}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '-1px',
            minHeight: 0,
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Line one — name + time */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 0.5,
              pr: '4px',
              minWidth: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0, flex: 1 }}>
              {showCheck && (
                <CheckOutlined sx={{ fontSize: 12, flexShrink: 0, color: 'inherit' }} />
              )}
              <Typography
                sx={{
                  fontSize: 12,
                  lineHeight: '16px',
                  fontWeight: 700,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textDecoration: strike ? 'line-through' : 'none',
                }}
              >
                {patientName}
              </Typography>
            </Box>
            <Typography
              className="appt-time"
              sx={{
                fontSize: 10,
                lineHeight: '16px',
                fontWeight: 500,
                flexShrink: 0,
                textDecoration: strike ? 'line-through' : 'none',
                opacity: status === 'completed' && !active ? 0.8 : 1,
                '@container appt-block (max-width: 130px)': { display: 'none' },
              }}
            >
              {timeLabel}
            </Typography>
          </Box>

          {/* Line two — case • type */}
          <Box sx={{ display: 'flex', gap: '6px', minWidth: 0, pr: '4px' }}>
            <Typography
              className="appt-case"
              sx={{
                fontSize: 10,
                lineHeight: '14px',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textDecoration: strike ? 'line-through' : 'none',
                opacity: status === 'completed' && !active ? 0.85 : 0.9,
                '& .appt-type': {
                  '@container appt-block (max-width: 130px)': { display: 'none' },
                },
              }}
            >
              {caseName}
              <Box component="span" className="appt-type">
                {` \u2022 ${appointmentType}`}
              </Box>
            </Typography>
          </Box>

          {/* Bottom — facility / status label + alerts */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 0.5,
              mt: 'auto',
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1px',
                pl: '6px',
                pb: '3px',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {status === 'canceled' || status === 'noShow' ? (
                <StatusAlertLabel status={status} active={active} />
              ) : (
                <Box
                  className="appt-facility"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1px',
                    minWidth: 0,
                    overflow: 'hidden',
                    '@container appt-block (max-width: 130px)': { display: 'none' },
                  }}
                >
                  <PlaceOutlined sx={{ fontSize: 12, flexShrink: 0 }} />
                  <Typography
                    sx={{
                      fontSize: 10,
                      lineHeight: '14px',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {facilityName}
                  </Typography>
                </Box>
              )}
            </Box>
            <AlertIcons alerts={alerts} active={active} status={status} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
