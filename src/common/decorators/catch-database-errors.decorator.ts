import { InternalServerErrorException } from '@nestjs/common';

export const CatchDatabaseErrors = () => {
  return (target: any) => {
    const prototype = target.prototype;
    const propertyNames = Object.getOwnPropertyNames(prototype);

    propertyNames.forEach((propertyName) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

      if (!descriptor || typeof descriptor.value !== 'function') {
        throw new InternalServerErrorException();
      }

      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        try {
          return await originalMethod.apply(this, args);
        } catch (e) {
          console.error(e);

          throw new InternalServerErrorException();
        }
      };

      Object.defineProperty(prototype, propertyName, descriptor);
    });
  };
};
