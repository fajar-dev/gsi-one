import TestRenderer, { act } from 'react-test-renderer';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ActionButton } from '../../src/components/ui/ActionButton';
it('preserves the disabled state and a minimum usable touch area', () => {
  let view!: TestRenderer.ReactTestRenderer;
  act(() => {
    view = TestRenderer.create(
      <ActionButton
        disabled
        accessibilityLabel="Simpan"
        style={{ width: 20, height: 20 }}
      />,
    );
  });
  const button = view.root.findByType(TouchableOpacity);
  expect(button.props.accessibilityRole).toBe('button');
  expect(button.props.accessibilityLabel).toBe('Simpan');
  expect(button.props.accessibilityState.disabled).toBe(true);
  const style = StyleSheet.flatten(button.props.style);
  expect(style.justifyContent).toBe('center');
  expect(style.minWidth).toBeGreaterThanOrEqual(44);
  expect(style.minHeight).toBeGreaterThanOrEqual(44);
  act(() => view.unmount());
});

it('keeps a modal container from grouping its form as a button', () => {
  let view!: TestRenderer.ReactTestRenderer;
  act(() => {
    view = TestRenderer.create(<ActionButton accessible={false} />);
  });
  expect(
    view.root.findByType(TouchableOpacity).props.accessibilityRole,
  ).toBeUndefined();
  act(() => view.unmount());
});

it('lets a structured row keep its own content distribution', () => {
  let view!: TestRenderer.ReactTestRenderer;
  act(() => {
    view = TestRenderer.create(
      <ActionButton
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      />,
    );
  });
  const style = StyleSheet.flatten(
    view.root.findByType(TouchableOpacity).props.style,
  );
  expect(style.justifyContent).toBe('space-between');
  act(() => view.unmount());
});

it('keeps compact labels centered with smaller visuals and extra hitSlop', () => {
  let view!: TestRenderer.ReactTestRenderer;
  act(() => {
    view = TestRenderer.create(
      <ActionButton compact style={{ minHeight: 44 }} />,
    );
  });
  const button = view.root.findByType(TouchableOpacity);
  const style = StyleSheet.flatten(button.props.style);
  expect(style.minHeight).toBe(36);
  expect(style.justifyContent).toBe('center');
  expect(button.props.hitSlop).toBe(4);
  act(() => view.unmount());
});

it('preserves custom hitSlop for compact actions', () => {
  let view!: TestRenderer.ReactTestRenderer;
  act(() => {
    view = TestRenderer.create(
      <ActionButton compact hitSlop={{ top: 6, bottom: 6 }} />,
    );
  });
  expect(view.root.findByType(TouchableOpacity).props.hitSlop).toEqual({
    top: 6,
    bottom: 6,
  });
  act(() => view.unmount());
});
