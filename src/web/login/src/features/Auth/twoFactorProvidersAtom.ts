import { atom, selector } from 'recoil';
import { UserService } from '../User';

export const twoFactorProvidersAtom = atom({
  key: 'twoFactorProvidersAtom',
  default: selector({
    key: 'twoFactorProvidersAtom/Default',
    get: async () => {
      const userService = new UserService();
      const providers = await userService.getTwoFactorProviders();
      providers.result = providers.result.sort((a, b) => a.localeCompare(b));

      return providers;
    },
  }),
});
