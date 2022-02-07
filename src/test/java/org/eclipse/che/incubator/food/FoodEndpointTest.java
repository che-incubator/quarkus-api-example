/*
 * Copyright (c) 2022 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.incubator.food;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class FoodEndpointTest {

    @Test
    public void testListAll() {
        Food[] foods = given()
                .when().get("/food")
                .then().statusCode(200)
                .extract().as(Food[].class);
        assertEquals(5, foods.length);
        assertEquals("Apple pie", foods[0].name);
        assertEquals("Orange", foods[1].name);
        assertEquals("Sandwich", foods[2].name);
        assertEquals("Soup", foods[3].name);
        assertEquals("Strawberry cake", foods[4].name);
    }

    @Test
    public void testGetById() {
        Food food = given()
                .when().get("/food/1")
                .then().statusCode(200)
                .extract().as(Food.class);
        assertEquals(1, food.id);
        assertEquals("Orange", food.name);
        assertEquals("Fruit Bistro", food.restaurantName);
        assertEquals(0.99, food.price);
    }

    @Test
    public void testGetByName() {
        Food food = given()
                .when().get("/food/search/Orange")
                .then().statusCode(200)
                .extract().as(Food.class);
        assertEquals(1, food.id);
        assertEquals("Orange", food.name);
        assertEquals("Fruit Bistro", food.restaurantName);
        assertEquals(0.99, food.price);
    }
}