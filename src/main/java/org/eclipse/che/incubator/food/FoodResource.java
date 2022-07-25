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

import java.net.URI;
import java.util.List;

import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.quarkus.panache.common.Sort;

@Path("/food")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FoodResource {

    @GET
    public List<Food> list() {
        return Food.listAll(Sort.by("name"));
    }

    @GET
    @Path("/{id}")
    public Food getById(@PathParam("id") Long id) {
        return Food.findById(id);
    }

    @POST
    @Transactional
    public Response create(Food food) {
        food.persist();
        if (food.isPersistent()) {
            return Response.created(URI.create("/food/" + food.id)).build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @GET
    @Path("search/{name}")
    public Food getByName(@PathParam("name") String name) {
        return Food.find("name", name).firstResult();
    }

    @GET
    @Path("restaurant/{restaurantName}")
    public List<Food> listByRestaurant(@PathParam("restaurantName") String restaurantName) {
        return Food.find("name", Sort.by("name"), restaurantName).list();
    }
}
