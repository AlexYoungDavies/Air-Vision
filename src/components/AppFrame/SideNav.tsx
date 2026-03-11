import { useState } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { MaterialSymbol } from 'react-material-symbols';

const ICON_WEIGHT = 300;
const SIDEBAR_WIDTH = 180;
const SIDEBAR_COLLAPSED = 56;
const ITEM_HEIGHT = 28;
const NAV_ITEM_FONT_SIZE = 14;
const SECTION_HEADER_FONT_SIZE = 11;

const topNavItems = [
  { id: 'home', label: 'Home', icon: 'home', active: true },
  { id: 'visits', label: 'Visits', icon: 'calendar_month', active: false },
  { id: 'messages', label: 'Message & Tasks', icon: 'chat', active: false },
];

const medicalRecordsItems = [
  { id: 'patients', label: 'Patients', icon: 'person', fill: true },
  { id: 'orders', label: 'Orders', icon: 'featured_play_list' },
  { id: 'pharmacies', label: 'Pharmacies', icon: 'medication' },
];

const businessItems = [
  { id: 'overview', label: 'Overview', icon: 'bar_chart' },
  { id: 'lead-management', label: 'Lead Management', icon: 'flag' },
  { id: 'outreach', label: 'Outreach', icon: 'how_to_reg' },
  { id: 'reports', label: 'Reports', icon: 'show_chart' },
];

const revenueCycleItems = [
  { id: 'encounters', label: 'Encounters', icon: 'inbox' },
  { id: 'claims', label: 'Claims', icon: 'assignment' },
  { id: 'remittances', label: 'Remittances', icon: 'receipt_long' },
  { id: 'eobs', label: 'EoBs', icon: 'description' },
  { id: 'payments', label: 'Payments', icon: 'credit_card' },
  { id: 'statements', label: 'Statements', icon: 'request_quote' },
];

const bottomNavItems = [
  { id: 'preferences', label: 'Preferences', icon: 'settings' },
  { id: 'logout', label: 'Log Out', icon: 'logout' },
];

function NavItem({
  label,
  icon,
  fill,
  active,
  collapsed,
}: {
  label: string;
  icon: string;
  fill?: boolean;
  active?: boolean;
  collapsed: boolean;
}) {
  return (
    <ListItemButton
      sx={{
        height: ITEM_HEIGHT,
        minHeight: ITEM_HEIGHT,
        maxHeight: ITEM_HEIGHT,
        py: 0,
        px: 1,
        gap: 0.75,
        borderRadius: 1,
        justifyContent: collapsed ? 'center' : 'flex-start',
        bgcolor: active ? 'rgba(0, 102, 70, 0.2)' : 'transparent',
        '&:hover': {
          bgcolor: active ? 'rgba(0, 102, 70, 0.25)' : 'action.hover',
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 'auto' : 18,
          justifyContent: 'center',
          color: active ? 'primary.dark' : 'text.secondary',
        }}
      >
        <MaterialSymbol
          icon={icon as never}
          size={18}
          weight={ICON_WEIGHT}
          fill={fill ?? false}
          color="currentColor"
        />
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: NAV_ITEM_FONT_SIZE,
            lineHeight: '22px',
            fontWeight: active ? 500 : 400,
            color: active ? 'primary.dark' : 'text.secondary',
          }}
        />
      )}
    </ListItemButton>
  );
}

function SectionHeaderButton({
  label,
  expanded,
  onClick,
  collapsed,
}: {
  label: string;
  expanded: boolean;
  onClick: () => void;
  collapsed: boolean;
}) {
  if (collapsed) return null;
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        height: ITEM_HEIGHT,
        minHeight: ITEM_HEIGHT,
        maxHeight: ITEM_HEIGHT,
        py: 0,
        px: 1,
        gap: '2px',
        borderRadius: 1,
        justifyContent: 'flex-start',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        component="span"
        sx={{
          flex: '0 0 auto',
          fontSize: SECTION_HEADER_FONT_SIZE,
          fontWeight: 700,
          lineHeight: '18px',
          color: 'text.secondary',
        }}
      >
        {label}
      </Box>
      <MaterialSymbol
        icon="keyboard_arrow_down"
        size={14}
        weight={ICON_WEIGHT}
        color="currentColor"
        style={{
          transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s',
        }}
      />
    </ListItemButton>
  );
}

export interface SideNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SideNav({ collapsed, onToggle }: SideNavProps) {
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  const [medicalRecordsOpen, setMedicalRecordsOpen] = useState(true);
  const [businessOpen, setBusinessOpen] = useState(true);
  const [revenueCycleOpen, setRevenueCycleOpen] = useState(true);

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      {/* Logo + collapse */}
      <Box
        sx={{
          py: 0.25,
          px: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 40,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        {!collapsed && (
          <Box
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: 1,
              bgcolor: 'primary.main',
            }}
          />
        )}
        <IconButton
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          sx={{
            color: 'text.secondary',
            p: 0.5,
          }}
        >
          {collapsed ? (
            <MaterialSymbol
              icon="chevron_right"
              size={18}
              weight={ICON_WEIGHT}
              color="currentColor"
            />
          ) : (
            <MaterialSymbol
              icon="chevron_left"
              size={18}
              weight={ICON_WEIGHT}
              color="currentColor"
            />
          )}
        </IconButton>
      </Box>

      {/* Menu groups */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 0,
          px: 1,
          py: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {topNavItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                active={item.active}
                collapsed={collapsed}
              />
            ))}
          </List>

          <Box>
            <List disablePadding>
              <SectionHeaderButton
                label="Medical Records"
                expanded={medicalRecordsOpen}
                onClick={() => setMedicalRecordsOpen((o) => !o)}
                collapsed={collapsed}
              />
            </List>
            <Collapse in={medicalRecordsOpen}>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {medicalRecordsItems.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    fill={item.fill}
                    collapsed={collapsed}
                  />
                ))}
              </List>
            </Collapse>
          </Box>

          <Box>
            <List disablePadding>
              <SectionHeaderButton
                label="Business"
                expanded={businessOpen}
                onClick={() => setBusinessOpen((o) => !o)}
                collapsed={collapsed}
              />
            </List>
            <Collapse in={businessOpen}>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {businessItems.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    collapsed={collapsed}
                  />
                ))}
              </List>
            </Collapse>
          </Box>

          <Box>
            <List disablePadding>
              <SectionHeaderButton
                label="Revenue Cycle"
                expanded={revenueCycleOpen}
                onClick={() => setRevenueCycleOpen((o) => !o)}
                collapsed={collapsed}
              />
            </List>
            <Collapse in={revenueCycleOpen}>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {revenueCycleItems.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    collapsed={collapsed}
                  />
                ))}
              </List>
            </Collapse>
          </Box>
        </Box>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}
