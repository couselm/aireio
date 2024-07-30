import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import {
  Adapt,
  Label,
  Select,
  Sheet,
  XStack,
  YStack,
  getFontSize,
} from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

const DropDown = ({ val, setVal }) => {
  const items = [
    { val: 500, label: '500 meters' },
    { val: 1000, label: '1000 meters' },
    { val: 3000, label: '3000 meters' },
    { val: 5000, label: '5000 meters' },
    { val: 10000, label: '10000 meters' },
  ];

  return (
    <YStack gap='$4'>
      <XStack ai='center' gap='$4'>
        <Label htmlFor='select-radius' f={1} miw={80}>
          Radius
        </Label>
        <Select
          id='select-radius'
          value={val.toString()}
          onValueChange={(value) => setVal(Number(value))}
          disablePreventBodyScroll
        >
          <Select.Trigger width={220} iconAfter={ChevronDown}>
            <Select.Value placeholder='Select radius' />
          </Select.Trigger>

          <Adapt when='sm' platform='touch'>
            <Sheet
              native
              modal
              dismissOnSnapToBottom
              animationConfig={{
                type: 'spring',
                damping: 20,
                mass: 1.2,
                stiffness: 250,
              }}
            >
              <Sheet.Frame>
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay
                animation='lazy'
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            </Sheet>
          </Adapt>

          <Select.Content zIndex={200000}>
            <Select.ScrollUpButton
              alignItems='center'
              justifyContent='center'
              position='relative'
              width='100%'
              height='$3'
            >
              <YStack zIndex={10}>
                <ChevronUp size={20} />
              </YStack>
              <LinearGradient
                start={[0, 0]}
                end={[0, 1]}
                fullscreen
                colors={['$background', 'transparent']}
                borderRadius='$4'
              />
            </Select.ScrollUpButton>

            <Select.Viewport minWidth={200}>
              <Select.Group>
                <Select.Label>Radius</Select.Label>
                {items.map((item, i) => (
                  <Select.Item
                    index={i}
                    key={item.val}
                    value={item.val.toString()}
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator marginLeft='auto'>
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
              <YStack
                position='absolute'
                right={0}
                top={0}
                bottom={0}
                alignItems='center'
                justifyContent='center'
                width={'$4'}
                pointerEvents='none'
              >
                <ChevronDown size={getFontSize('$true')} />
              </YStack>
            </Select.Viewport>

            <Select.ScrollDownButton
              alignItems='center'
              justifyContent='center'
              position='relative'
              width='100%'
              height='$3'
            >
              <YStack zIndex={10}>
                <ChevronDown size={20} />
              </YStack>
              <LinearGradient
                start={[0, 0]}
                end={[0, 1]}
                fullscreen
                colors={['transparent', '$background']}
                borderRadius='$4'
              />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select>
      </XStack>
    </YStack>
  );
};

export default DropDown;
