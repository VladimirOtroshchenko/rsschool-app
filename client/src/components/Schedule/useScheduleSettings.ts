import { useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import { DEFAULT_COLORS } from 'components/Schedule/constants';

enum LocalStorage {
  ViewMode = 'scheduleViewMode',
  Timezone = 'scheduleTimezone',
  LimitForDoneTasks = 'scheduleLimitForDoneTask',
  IsSplittedByWeek = 'scheduleIsSplitedByWeek',
  ArePassedEventsHidden = 'scheduleArePassedEventsHidden',
  AreDoneTasksHidden = 'scheduleAreDoneTasksHidden',
  TagColors = 'scheduleTagColors',
  ColumnsHidden = 'scheduleColumnsHidden',
  EventTypesHidden = 'scheduleEventTypesHidden',
}

export interface ScheduleSettings {
  timezone: string;
  setTimezone: (value: string) => void;
  limitForDoneTask: number;
  setLimitForDoneTask: (value: number) => void;
  isSplittedByWeek: boolean;
  setIsSplittedByWeek: (value: boolean) => void;
  arePassedEventsHidden: boolean;
  setArePassedEventsHidden: (value: boolean) => void;
  areDoneTasksHidden: boolean;
  setAreDoneTasksHidden: (value: boolean) => void;
  tagColors: Record<string, string>;
  setTagColors: (value: Record<string, string>) => void;
  columnsHidden: string[];
  setColumnsHidden: (value: string[]) => void;
  eventTypesHidden: string[];
  setEventTypesHidden: (value: string[]) => void;
}

const useScheduleSettings = (): ScheduleSettings => {
  const [limitForDoneTask = 100, setLimitForDoneTask] = useLocalStorage<number>(LocalStorage.LimitForDoneTasks);
  const [isSplittedByWeek = false, setIsSplittedByWeek] = useLocalStorage<boolean>(LocalStorage.IsSplittedByWeek);
  const [arePassedEventsHidden = false, setArePassedEventsHidden] = useLocalStorage<boolean>(
    LocalStorage.ArePassedEventsHidden,
  );
  const [areDoneTasksHidden = false, setAreDoneTasksHidden] = useLocalStorage<boolean>(LocalStorage.AreDoneTasksHidden);
  const [tagColors = DEFAULT_COLORS, setTagColors] = useLocalStorage<Record<string, string>>(LocalStorage.TagColors);
  const [columnsHidden = [], setColumnsHidden] = useLocalStorage<string[]>(LocalStorage.ColumnsHidden);
  const [eventTypesHidden = [], setEventTypesHidden] = useLocalStorage<string[]>(LocalStorage.EventTypesHidden);
  const [timezone = Intl.DateTimeFormat().resolvedOptions().timeZone, setTimezone] = useLocalStorage<string>(
    LocalStorage.Timezone,
  );

  return useMemo(
    () => ({
      timezone,
      setTimezone,
      limitForDoneTask,
      setLimitForDoneTask,
      isSplittedByWeek,
      setIsSplittedByWeek,
      arePassedEventsHidden,
      setArePassedEventsHidden,
      areDoneTasksHidden,
      setAreDoneTasksHidden,
      tagColors,
      setTagColors,
      columnsHidden,
      setColumnsHidden,
      eventTypesHidden,
      setEventTypesHidden,
    }),
    [
      timezone,
      limitForDoneTask,
      isSplittedByWeek,
      arePassedEventsHidden,
      areDoneTasksHidden,
      tagColors,
      columnsHidden,
      eventTypesHidden,
    ],
  );
};

export default useScheduleSettings;
