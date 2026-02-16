<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;

class HotelController extends Controller
{
    public function index(): JsonResponse
    {
        $hotels = Hotel::where('is_active', true)->paginate(15);

        return response()->json([
            'data' => HotelResource::collection($hotels),
            'meta' => [
                'current_page' => $hotels->currentPage(),
                'last_page' => $hotels->lastPage(),
                'per_page' => $hotels->perPage(),
                'total' => $hotels->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $hotel = Hotel::with(['roomTypes.amenities'])->findOrFail($id);

        return response()->json([
            'data' => new HotelResource($hotel),
        ]);
    }
}
