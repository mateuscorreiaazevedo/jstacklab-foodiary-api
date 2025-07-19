import { eq } from "drizzle-orm";
import { db } from "../db";
import { schemas } from "../db/schemas";

export class ProcessMeal {
  static async process({fileKey}: {fileKey: string}) {
    const meal = await db.query.meals.findFirst({
      where: eq(schemas.meals.inputFileKey, fileKey),
    })

    if (!meal) {
      throw new Error('Meal not found')
    }

    if (meal.status === 'FAILED' || meal.status === 'SUCCESS') {
      return
    }

    await db.update(schemas.meals).set({
      status: 'PROCESSING'
    }).where(eq(schemas.meals.id, meal.id))

    try {
      // TODO: Call IA
      await db.update(schemas.meals).set({
        status: 'SUCCESS',
        name: 'Cafézinho',
        icon: '☕️',
        foods: [
          {
            name: 'Café',
            quantity: 1,
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
          }
        ]
      }).where(eq(schemas.meals.id, meal.id))
    } catch (error) {
      await db.update(schemas.meals).set({
        status: 'FAILED'
      }).where(eq(schemas.meals.id, meal.id))
    }
  }
}