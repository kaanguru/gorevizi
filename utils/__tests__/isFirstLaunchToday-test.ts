import { isFirstLaunchToday, resetFirstLaunchToday } from '~/utils/isFirstLaunchToday';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday, addDays } from 'date-fns';

describe('isFirstLaunchToday', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return true if there is no previous launch date stored', async () => {
    const mockGetItem = jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null);
    const mockSetItem = jest.spyOn(AsyncStorage, 'setItem');

    const result = await isFirstLaunchToday();
    expect(result).toBe(true);
    expect(mockGetItem).toHaveBeenCalledWith('@gorevizi:lastLaunchDate');
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('Should return false if previous launch was today', async () => {
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd');

    const mockGetItem = jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(formattedToday);
    const mockSetItem = jest.spyOn(AsyncStorage, 'setItem');

    const result = await isFirstLaunchToday();
    expect(result).toBe(false);
    expect(mockGetItem).toHaveBeenCalledWith('@gorevizi:lastLaunchDate');
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('Should return true if previous launch was yesterday', async () => {
    const yesterdayDate = addDays(new Date(), -1);
    const formattedYesterday = format(yesterdayDate, 'yyyy-MM-dd');

    const mockGetItem = jest
      .spyOn(AsyncStorage, 'getItem')
      .mockResolvedValueOnce(formattedYesterday);
    const mockSetItem = jest.spyOn(AsyncStorage, 'setItem');

    const result = await isFirstLaunchToday();
    expect(result).toBe(true);
    expect(mockGetItem).toHaveBeenCalledWith('@gorevizi:lastLaunchDate');
    expect(mockSetItem).toHaveBeenCalled();
  });
});

describe('resetFirstLaunchToday', () => {
  it('Should remove the launch date from storage', async () => {
    const mockRemoveItem = jest.spyOn(AsyncStorage, 'removeItem');

    await resetFirstLaunchToday();
    expect(mockRemoveItem).toHaveBeenCalledWith('@gorevizi:lastLaunchDate');
  });
});
