import React, { useState } from 'react';
import {
  Button,
  Input,
  TextArea,
  Select,
  Checkbox,
  RadioButton,
  ToggleSwitch,
  Badge,
  Avatar,
  Spinner,
  ThemeToggle,
  Card,
  Modal,
  ConfirmDialog,
  PageContainer,
  SectionContainer,
  Breadcrumbs,
  EmptyState,
  ErrorState,
  LoadingState,
} from './index';

export default function ComponentShowcase() {
  // Interactive state handlers for showcase
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toggleChecked, setToggleChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [inputValue, setInputValue] = useState('John Doe');
  const [selectValue, setSelectValue] = useState('react');
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSimulateLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'UI Library', href: '#' },
    { label: 'Component Showcase' },
  ];

  const selectOptions = [
    { value: 'react', label: 'React 19' },
    { value: 'tailwind', label: 'Tailwind CSS v4' },
    { value: 'vite', label: 'Vite Bundler' },
  ];

  return (
    <PageContainer
      title="UI Component Library Showcase"
      subtitle="Interactive preview of all 22+ reusable components built for Study Mentor AI"
      breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
      actions={
        <div className="flex items-center gap-3">
          <ThemeToggle size="md" />
          <Button
            variant="primary"
            loading={btnLoading}
            onClick={handleSimulateLoading}
          >
            {btnLoading ? 'Simulating...' : 'Test Loading State'}
          </Button>
        </div>
      }
    >
      <div className="space-y-12 pb-16">

        {/* 1. BUTTONS */}
        <SectionContainer title="1. Buttons" subtitle="5 variants, 3 sizes, loading state, icon support">
          <Card className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Variants</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Sizes</h4>
              <div className="flex flex-wrap items-end gap-3">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md)</Button>
                <Button size="lg">Large (lg)</Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">States & Icons</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
                <Button
                  leftIcon={
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                  }
                >
                  With Left Icon
                </Button>
              </div>
            </div>
          </Card>
        </SectionContainer>

        {/* 2. FORM CONTROLS */}
        <SectionContainer title="2. Form Controls" subtitle="Inputs, TextAreas, Selects, Checkboxes, Radios, Toggles">
          <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="This name will appear on your progress certificates."
            />

            <Input
              label="Email Address (Error State)"
              placeholder="user@example.com"
              error="Please enter a valid email address."
            />

            <Select
              label="Preferred Framework"
              options={selectOptions}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              helperText="Select your primary tech stack"
            />

            <div className="space-y-4">
              <ToggleSwitch
                label="Enable Email Notifications"
                description="Receive daily study reminders and progress digests"
                checked={toggleChecked}
                onChange={(e) => setToggleChecked(e.target.checked)}
              />

              <Checkbox
                label="I agree to the Terms of Service"
                description="Required before starting AI mentor sessions"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Study Goal Preference</span>
              <div className="flex flex-wrap gap-6 pt-1">
                <RadioButton
                  name="studyGoal"
                  value="option1"
                  label="Daily Practice (15 mins/day)"
                  checked={radioValue === 'option1'}
                  onChange={() => setRadioValue('option1')}
                />
                <RadioButton
                  name="studyGoal"
                  value="option2"
                  label="Intensive Bootcamp (1 hr/day)"
                  checked={radioValue === 'option2'}
                  onChange={() => setRadioValue('option2')}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <TextArea
                label="Study Goals & Background"
                placeholder="Tell the AI Mentor about your current knowledge level and targets..."
                rows={3}
              />
            </div>
          </Card>
        </SectionContainer>

        {/* 3. DISPLAY & INDICATORS */}
        <SectionContainer title="3. Badges, Avatars & Loaders" subtitle="Status indicators, user profile avatars, spinning loaders">
          <Card className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Badges</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary" dot>Primary</Badge>
                <Badge variant="secondary" dot>Secondary</Badge>
                <Badge variant="success" dot>Success</Badge>
                <Badge variant="warning" dot>Warning</Badge>
                <Badge variant="danger" dot>Danger</Badge>
                <Badge variant="info" dot>Info</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Avatars</h4>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar name="Alex Rivera" size="xs" status="online" />
                <Avatar name="Sarah Connor" size="sm" status="online" />
                <Avatar name="John Doe" size="md" status="busy" />
                <Avatar name="Emily Watson" size="lg" status="away" />
                <Avatar name="Vijay Chikkala" size="xl" status="online" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Spinner Loaders</h4>
              <div className="flex items-center gap-6">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" color="text-violet-500" />
              </div>
            </div>
          </Card>
        </SectionContainer>

        {/* 4. MODALS & DIALOGS */}
        <SectionContainer title="4. Modals & Dialogs" subtitle="Interactive overlays with focus trapping and backdrop blur">
          <Card className="flex flex-wrap gap-4">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Demo Modal
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Open Confirm Dialog
            </Button>
          </Card>
        </SectionContainer>

        {/* 5. FEEDBACK STATES */}
        <SectionContainer title="5. Feedback Views" subtitle="Empty state, Error state, Loading state">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState
              title="No Practice Tests Found"
              description="You haven't completed any mock interviews yet. Start your first session to track progress."
              actionLabel="Start New Test"
              onAction={() => alert('Start Test Clicked!')}
            />

            <ErrorState
              title="Failed to Load Recommendations"
              message="The AI engine could not synthesize topic recommendations. Please retry."
              onRetry={() => alert('Retrying...')}
            />
          </div>
        </SectionContainer>

      </div>

      {/* DEMO MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Interactive Modal Title"
        description="This modal is rendered via React portal outside the main DOM tree."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>

            <Button variant="primary" onClick={() => setModalOpen(false)}>Save Changes</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Modal windows support backdrop blur, keyboard closing via the <kbd className="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 rounded border">Esc</kbd> key, and smooth scale animation.
        </p>
      </Modal>

      {/* DEMO CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert('Action Confirmed!');
        }}
        title="Delete Assessment Session?"
        message="Are you sure you want to delete this study session? All recorded AI feedback will be permanently removed."
        confirmText="Delete Session"
        variant="danger"
      />
    </PageContainer>
  );
}
