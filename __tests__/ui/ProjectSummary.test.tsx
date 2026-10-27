import TestRenderer, { act } from 'react-test-renderer';
import { Circle } from 'react-native-svg';
import ProjectSummary from '../../src/screens/Dashboard/components/ProjectSummary';

it('renders exact, consecutive proportions for project statuses', () => {
  let view!: TestRenderer.ReactTestRenderer;
  act(() => {
    view = TestRenderer.create(
      <ProjectSummary
        isLoading={false}
        stats={{ total: 3, on_progress: 2, pending: 1, done: 0, on_hold: 0 }}
      />,
    );
  });
  const circles = view.root.findAllByType(Circle);
  expect(circles).toHaveLength(2);
  const [firstLength, firstGap] = circles[0].props.strokeDasharray;
  const [secondLength] = circles[1].props.strokeDasharray;
  expect(firstLength / (firstLength + firstGap)).toBeCloseTo(2 / 3);
  expect(secondLength / (firstLength + firstGap)).toBeCloseTo(1 / 3);
  expect(circles[1].props.strokeDashoffset).toBeCloseTo(-firstLength);
  act(() => view.unmount());
});
