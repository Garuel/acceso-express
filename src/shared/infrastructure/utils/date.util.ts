import ms from "ms";

export class DateUtil {
  static addTimeToCurrentDate(timeString: string): Date {
    const milliseconds = ms(timeString as any);

    if (milliseconds === undefined) {
      throw new Error(`[DateUtil] Formato de tiempo inválido: ${timeString}`);
    }

    return new Date(Date.now() + milliseconds);
  }
}
