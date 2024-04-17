import { apiUrl } from "../routes";
import { createUser } from "../types";

export const getUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}/users`, { cache: "no-store" });
    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
  }
};

export const getOneUser = async (id: string) => {
  try {
    const response = await fetch(`${apiUrl}/users/${id}`);
    const json = await response.json();

    return json;
  } catch (err) {
    console.log(err);
  }
};

export const userCreate = async (body: createUser) => {
  try {
    const res = await fetch(apiUrl + "/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    return json;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await fetch(apiUrl + "/users/" + id, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) {
      return json;
    } else {
      throw new Error("Error al eliminar");
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (id: string, data: createUser) => {
  try {
    const res = await fetch(apiUrl + "/users/" + id, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      return json;
    } else {
      throw new Error("Error al actualizar");
    }
  } catch (err) {
    console.log(err);
  }
};
