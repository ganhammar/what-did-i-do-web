import { atom, selector } from 'recoil';
import { UserService } from '../User';

export const twoFactorProvidersAtom = atom({
  key: 'twoFactorProvidersAtom',
  default: selector({
    key: 'twoFactorProvidersAtom/Default',
    get: async ({ get }) => {
      const userService = new UserService();
      return await userService.getTwoFactorProviders();
    },
  }),
});
