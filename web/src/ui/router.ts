/* Router module to handle navigation and user interactions in the Motorcycle Maintenance Assistant app. Listens for click events on elements with data-action attributes and triggers corresponding actions.
 */

import { render } from '../dom/render';
import { dom } from '../dom/selectors';
import { req } from '../utils/dom-helper';
import { bikeStore, readBikeForm } from '../state/bike-store';
import { appState } from '../types/state';
import {
  getMaintenanceTask,
  maintenanceStore,
  readMaintenanceLogForm,
  readMaintenanceScheduleForm,
} from '../state/maintenance-store';
import {
  readLoginForm,
  readRegForm,
  setCurrentUser,
} from '../state/auth-state';
import { loginUser, registerUser } from '../api/auth';

type Action =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.register'
  | 'nav.login'
  | 'nav.register'
  | 'nav.garage'
  | 'nav.bikeAdd'
  | 'bike.open'
  | 'bike.edit.open'
  | 'bike.delete'
  | 'bike.add.submit'
  | 'bike.edit.submit'
  | 'log.service'
  | 'schedule.service'
  | 'modal.close'
  | 'schedule.submit'
  | 'log.submit';

function bindEvents(): void {
  document.addEventListener('click', async (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const el = target.closest<HTMLElement>('[data-action]');
    if (!el) return;

    const action = el.dataset.action as Action;
    if (!action) return;

    switch (action) {
      case 'nav.login':
        const forms = document.querySelectorAll('form');

        forms.forEach((form) => {
          (form as HTMLFormElement).reset();
        });
        render.initialScreen();
        break;

      case 'auth.login': {
        try {
          const loginForm = dom.loginForm as HTMLFormElement;
          const input = readLoginForm(loginForm);
          const response = await loginUser(input.email, input.password);

          setCurrentUser(response.user);

          loginForm?.reset();
          render.errorMessage('Login success, opening garage...', 'auth.login');
          setTimeout(() => {
            render.garageScreen();
          }, 2000);
        } catch (error) {
          error instanceof Error
            ? render.errorMessage(error.message, action)
            : render.errorMessage('Something went wrong', action);
        }
        break;
      }

      case 'nav.register':
        const loginForm = dom.loginForm as HTMLFormElement;
        loginForm?.reset();
        render.registerScreen();
        break;

      case 'auth.register': {
        try {
          const regForm = dom.regForm as HTMLFormElement;
          const input = readRegForm(regForm);
          await registerUser(input.email, input.password);
          render.errorMessage('Registration successful!', 'auth.register');
          regForm?.reset();
          setTimeout(() => {
            render.initialScreen();
          }, 3000);
        } catch (error) {
          error instanceof Error
            ? render.errorMessage(error.message, action)
            : render.errorMessage('Something went wrong', action);
        }
        break;
      }

      case 'auth.logout':
        setCurrentUser(null);
        render.errorMessage('', action);
        render.initialScreen();
        break;

      case 'nav.garage':
        render.garageScreen();
        break;

      case 'nav.bikeAdd':
        render.addBikeScreen();
        break;

      case 'bike.add.submit': {
        try {
          const addBikeForm = (dom.addBikeForm as HTMLFormElement) || null;
          const input = readBikeForm(addBikeForm);

          bikeStore.addBike(input);
          addBikeForm.reset();
          render.garageScreen();
        } catch (error) {
          error instanceof Error
            ? render.errorMessage(error.message, action)
            : render.errorMessage('Something went wrong', action);
        }
        break;
      }

      case 'bike.delete':
        try {
          const el = target.closest<HTMLElement>('[data-action]');
          const id = el?.dataset.bikeId;

          if (!id) break;

          bikeStore.deleteBike(id);
          render.garageScreen();
        } catch (error) {
          console.error(error);
        }
        break;

      case 'bike.edit.open':
        render.editBikeScreen();

        appState.selectedBikeId =
          target.closest<HTMLElement>('[data-action]')?.dataset.bikeId;

        if (!appState.selectedBikeId) break;

        appState.selectedBikeFound = bikeStore.getBike(appState.selectedBikeId);
        if (!appState.selectedBikeFound) break;

        const editMake = dom.editBikeMake;
        const editYear = dom.editBikeYear;
        const editModel = dom.editBikeModel;
        const editOdo = dom.editBikeOdo;
        const editId = dom.editBikeId;

        if (!editMake || !editYear || !editModel || !editOdo || !editId) {
          throw new Error('Edit form inputs missing from DOM');
        }

        editId.value = appState.selectedBikeId;

        editMake.value = appState.selectedBikeFound.make;
        editYear.value = String(appState.selectedBikeFound.year);
        editModel.value = appState.selectedBikeFound.model;
        editOdo.value = String(appState.selectedBikeFound.odo);

        break;

      case 'bike.edit.submit': {
        const bikeEditForm = dom.editBikeForm as HTMLFormElement | null;
        if (!bikeEditForm) throw new Error('Missing edit bike form');

        const idInput = dom.editBikeId as HTMLInputElement | null;
        const id = idInput?.value?.trim();
        if (!id) throw new Error('Missing bike id for edit submit');

        try {
          const form = readBikeForm(bikeEditForm);
          bikeStore.updateBike(id, form);
          bikeEditForm.reset();
          render.errorMessage('', action);
          render.garageScreen();
        } catch (error) {
          error instanceof Error
            ? render.errorMessage(error.message, action)
            : render.errorMessage('Something went wrong', action);
        }
        break;
      }

      case 'bike.open': {
        render.maintenanceScreen();

        appState.selectedBikeId =
          target.closest<HTMLElement>('[data-action]')?.dataset.bikeId;
        if (!appState.selectedBikeId) break;

        req(dom.maintenanceEditBtn, 'maintenanceEditBtn').dataset.bikeId =
          appState.selectedBikeId;
        req(dom.maintenanceDeleteBtn, 'maintenanceDeleteBtn').dataset.bikeId =
          appState.selectedBikeId;
        req(dom.bikeScreen, 'bikeScreen').dataset.bikeId =
          appState.selectedBikeId;

        appState.selectedBikeFound = bikeStore.getBike(appState.selectedBikeId);
        if (!appState.selectedBikeFound) break;

        (dom.maintenanceBikeName as HTMLElement).innerHTML =
          appState.selectedBikeFound.make;
        (dom.maintenanceBikeModel as HTMLElement).innerHTML =
          appState.selectedBikeFound.model;
        (dom.maintenanceBikeOdo as HTMLElement).innerHTML = String(
          appState.selectedBikeFound.odo,
        );

        maintenanceStore.updateTaskInfo(appState.selectedBikeId);
        maintenanceStore.updateOverallProgress(dom);
        break;
      }

      case 'log.service': {
        const maintenanceItem =
          target.closest<HTMLElement>('[data-action]')?.parentElement
            ?.parentElement?.dataset.name;

        if (!maintenanceItem) break;
        appState.currentMaintenanceItem = maintenanceItem;

        render.openServiceModal('log.service');
        break;
      }

      case 'log.submit': {
        try {
          const maintenanceForm =
            (dom.logServiceForm as HTMLFormElement) || null;
          const input = readMaintenanceLogForm(maintenanceForm);

          const bikeId = appState.selectedBikeId;
          const currentTask = appState.currentMaintenanceItem;

          if (!bikeId) throw new Error('No bike selected');
          if (!currentTask) throw new Error('No maintenance item selected');

          const existingTask = getMaintenanceTask(bikeId, currentTask);

          if (!existingTask) {
            maintenanceStore.addMaintenanceTask(input, bikeId);
          } else {
            maintenanceStore.updateMaintenanceTask(existingTask.id, input);
          }

          maintenanceStore.updateTaskInfo(bikeId);
          maintenanceStore.updateOverallProgress(dom);
          maintenanceForm.reset();
          render.closeServiceModal();
        } catch (error) {
          error instanceof Error
            ? render.errorMessage(error.message, action)
            : render.errorMessage('Something went wrong', action);
        }
        break;
      }

      case 'schedule.service': {
        const maintenanceItem =
          target.closest<HTMLElement>('[data-action]')?.parentElement
            ?.parentElement?.dataset.name;
        if (!maintenanceItem) break;
        appState.currentMaintenanceItem = maintenanceItem;
        render.openServiceModal('schedule.service');
        break;
      }

      case 'schedule.submit': {
        try {
          const scheduleForm =
            (dom.scheduleServiceForm as HTMLFormElement) || null;
          const input = readMaintenanceScheduleForm(scheduleForm);

          const bikeId = appState.selectedBikeId;
          if (!bikeId) throw new Error('No bike selected');

          const currentTask = appState.currentMaintenanceItem;
          if (!currentTask) throw new Error('No maintenance item selected');

          const patch = {
            intervalDays:
              input.intervalDays !== null ? Number(input.intervalDays) : null,
            intervalKm:
              input.intervalKm !== null ? Number(input.intervalKm) : null,
          };

          maintenanceStore.scheduleTask(bikeId, currentTask, patch);
          maintenanceStore.updateTaskInfo(bikeId);
          maintenanceStore.updateOverallProgress(dom);
          render.closeServiceModal();
          scheduleForm.reset();
        } catch (error) {
          error instanceof Error
            ? render.errorMessage(error.message, action)
            : render.errorMessage('Something went wrong', action);
        }
        break;
      }

      case 'modal.close': {
        render.closeServiceModal();
        break;
      }
    }
  });
}

export { bindEvents };
