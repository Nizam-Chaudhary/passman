import { and, eq } from "drizzle-orm";

import { db } from "../../db/index";
import * as schema from "../../db/schema";
import { BadRequestException, NotFoundException } from "../../lib/responseExceptions";

class UserService {
  async getVaults(userId: number) {
    const vaults = await db.query.vaults.findMany({
      where: eq(schema.vaults.userId, userId),
    });

    return {
      status: true,
      message: "Vaults retrieved successfully",
      data: vaults,
    };
  }

  async addVault(name: string, userId: number) {
    const vault = await db.query.vaults.findFirst({
      where: and(eq(schema.vaults.name, name), eq(schema.vaults.userId, userId)),
    });

    if (vault) {
      throw new BadRequestException(`Vault with name "${name}" already exists`);
    }
    await db.insert(schema.vaults).values({
      name,
      userId,
    });

    return {
      status: true,
      message: "Vault created successfully",
    };
  }

  async updateVault(id: number, name: string, userId: number) {
    const [updatedVault] = await db
      .update(schema.vaults)
      .set({ name })
      .where(and(eq(schema.vaults.id, id), eq(schema.vaults.userId, userId)));

    if (!updatedVault.affectedRows) {
      throw new NotFoundException("Vault not found");
    }

    return {
      status: true,
      message: "Vault updated successfully",
    };
  }

  async deleteVault(id: number, userId: number) {
    const [deletedVaults] = await db
      .delete(schema.vaults)
      .where(and(eq(schema.vaults.id, id), eq(schema.vaults.userId, userId)));

    if (!deletedVaults.affectedRows) {
      throw new NotFoundException("Vault not found");
    }

    return {
      status: true,
      message: "Vault deleted successfully",
    };
  }
}

export default new UserService();
