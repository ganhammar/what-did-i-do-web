import { atom, selector } from 'recoil';
import { UserService } from '../User';

export const authenticatorKeyAtom = atom({
  key: 'authenticatorKeyAtom',
  default: selector({
    key: 'authenticatorKeyAtom/Default',
    get: async () => {
      const userService = new UserService();
      return await userService.authenticatorKey();
    },
  }),
});
