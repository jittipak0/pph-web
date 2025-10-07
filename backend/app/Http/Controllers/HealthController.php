<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
	/**
	 * Minimal health endpoint.
	 */
	public function index(): JsonResponse
	{
		return response()->json(['ok' => true]);
	}
}
