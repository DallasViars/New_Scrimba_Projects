import { dogs } from "./data.js";
import { Dog } from "./Dog.js";
import { profileList } from "./index.js";

export function getNextProfile() {
  const nextProfile = dogs[profileList.shift()]
  return nextProfile ? new Dog(nextProfile) : {};
}

