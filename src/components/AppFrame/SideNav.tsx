import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlined from '@mui/icons-material/ChatOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import FeaturedPlayListOutlined from '@mui/icons-material/FeaturedPlayListOutlined';
import MedicationOutlined from '@mui/icons-material/MedicationOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined';
import ShowChartOutlined from '@mui/icons-material/ShowChartOutlined';
import InboxOutlined from '@mui/icons-material/InboxOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import RequestQuoteOutlined from '@mui/icons-material/RequestQuoteOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import type { SvgIconComponent } from '@mui/icons-material';

const NAV_ICONS: Record<string, SvgIconComponent> = {
  home: HomeOutlined,
  calendar_month: CalendarMonthOutlined,
  chat: ChatOutlined,
  person: PersonOutlined,
  featured_play_list: FeaturedPlayListOutlined,
  medication: MedicationOutlined,
  bar_chart: BarChartOutlined,
  flag: FlagOutlined,
  how_to_reg: HowToRegOutlined,
  show_chart: ShowChartOutlined,
  inbox: InboxOutlined,
  assignment: AssignmentOutlined,
  receipt_long: ReceiptLongOutlined,
  description: DescriptionOutlined,
  credit_card: CreditCardOutlined,
  request_quote: RequestQuoteOutlined,
  settings: SettingsOutlined,
  logout: LogoutOutlined,
  keyboard_arrow_down: KeyboardArrowDownOutlined,
  chevron_right: ChevronRightOutlined,
  chevron_left: ChevronLeftOutlined,
};

const SIDEBAR_WIDTH = 180;
const SIDEBAR_COLLAPSED = 56;
const ITEM_HEIGHT = 28;
const NAV_ITEM_FONT_SIZE = 14;
const SECTION_HEADER_FONT_SIZE = 11;

type NavItemConfig = {
  id: string;
  label: string;
  icon: string;
  path?: string;
  fill?: boolean;
};

const topNavItems: NavItemConfig[] = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'visits', label: 'Visits', icon: 'calendar_month' },
  { id: 'messages', label: 'Message & Tasks', icon: 'chat' },
];

const medicalRecordsItems: NavItemConfig[] = [
  { id: 'patients', label: 'Patients', icon: 'person', fill: true, path: '/patients' },
  { id: 'orders', label: 'Orders', icon: 'featured_play_list' },
  { id: 'pharmacies', label: 'Pharmacies', icon: 'medication' },
];

const businessItems: NavItemConfig[] = [
  { id: 'overview', label: 'Overview', icon: 'bar_chart' },
  { id: 'lead-management', label: 'Lead Management', icon: 'flag' },
  { id: 'outreach', label: 'Outreach', icon: 'how_to_reg' },
  { id: 'reports', label: 'Reports', icon: 'show_chart' },
];

const revenueCycleItems: NavItemConfig[] = [
  { id: 'encounters', label: 'Encounters', icon: 'inbox' },
  { id: 'claims', label: 'Claims', icon: 'assignment' },
  { id: 'remittances', label: 'Remittances', icon: 'receipt_long' },
  { id: 'eobs', label: 'EoBs', icon: 'description' },
  { id: 'payments', label: 'Payments', icon: 'credit_card' },
  { id: 'statements', label: 'Statements', icon: 'request_quote' },
];

const bottomNavItems: NavItemConfig[] = [
  { id: 'preferences', label: 'Preferences', icon: 'settings' },
  { id: 'logout', label: 'Log Out', icon: 'logout' },
];

function NavItem({
  label,
  icon,
  path,
  active,
  collapsed,
}: {
  label: string;
  icon: string;
  path?: string;
  active?: boolean;
  collapsed: boolean;
}) {
  const content = (
    <>
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 'auto' : 18,
          justifyContent: 'center',
          color: active ? 'primary.dark' : 'text.secondary',
        }}
      >
        {(() => {
          const IconComponent = NAV_ICONS[icon];
          return IconComponent ? <IconComponent sx={{ fontSize: 18 }} /> : null;
        })()}
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
    </>
  );

  const sx = {
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
  };

  if (path) {
    return (
      <ListItemButton component={Link} to={path} sx={sx}>
        {content}
      </ListItemButton>
    );
  }

  return <ListItemButton sx={sx}>{content}</ListItemButton>;
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
      <KeyboardArrowDownOutlined
        sx={{
          fontSize: 14,
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
  const location = useLocation();
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  const [medicalRecordsOpen, setMedicalRecordsOpen] = useState(true);
  const [businessOpen, setBusinessOpen] = useState(true);
  const [revenueCycleOpen, setRevenueCycleOpen] = useState(true);

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
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
            <ChevronRightOutlined sx={{ fontSize: 18 }} />
          ) : (
            <ChevronLeftOutlined sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>

      {/* Menu groups: 12px between groups; 24px bottom padding inside each list (only visible when expanded) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          px: 1,
          py: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            minHeight: 0,
          }}
        >
          {/* Universal (no heading) */}
          <Box component="nav" aria-label="Main">
            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, pb: 3 }}>
              {topNavItems.map((item) => (
                <NavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  path={item.path}
                  active={item.path === location.pathname}
                  collapsed={collapsed}
                />
              ))}
            </List>
          </Box>

          {/* Medical Records */}
          <Box component="nav" aria-label="Medical Records">
            <List disablePadding>
              <SectionHeaderButton
                label="Medical Records"
                expanded={medicalRecordsOpen}
                onClick={() => setMedicalRecordsOpen((o) => !o)}
                collapsed={collapsed}
              />
            </List>
            <Collapse in={medicalRecordsOpen}>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, pb: 3 }}>
                {medicalRecordsItems.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    path={item.path}
                    active={item.path === location.pathname}
                    collapsed={collapsed}
                  />
                ))}
              </List>
            </Collapse>
          </Box>

          {/* Business */}
          <Box component="nav" aria-label="Business">
            <List disablePadding>
              <SectionHeaderButton
                label="Business"
                expanded={businessOpen}
                onClick={() => setBusinessOpen((o) => !o)}
                collapsed={collapsed}
              />
            </List>
            <Collapse in={businessOpen}>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, pb: 3 }}>
                {businessItems.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    path={item.path}
                    active={item.path === location.pathname}
                    collapsed={collapsed}
                  />
                ))}
              </List>
            </Collapse>
          </Box>

          {/* Revenue Cycle */}
          <Box component="nav" aria-label="Revenue Cycle">
            <List disablePadding>
              <SectionHeaderButton
                label="Revenue Cycle"
                expanded={revenueCycleOpen}
                onClick={() => setRevenueCycleOpen((o) => !o)}
                collapsed={collapsed}
              />
            </List>
            <Collapse in={revenueCycleOpen}>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, pb: 3 }}>
                {revenueCycleItems.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    path={item.path}
                    active={item.path === location.pathname}
                    collapsed={collapsed}
                  />
                ))}
              </List>
            </Collapse>
          </Box>
        </Box>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, flexShrink: 0 }}>
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              path={item.path}
              active={item.path === location.pathname}
              collapsed={collapsed}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}
