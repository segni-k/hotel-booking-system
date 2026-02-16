<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\RoomSearchDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRoomsRequest;
use App\Http\Resources\RoomTypeResource;
use App\Models\Hotel;
use App\Models\RoomType;
use App\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    public function __construct(
        private readonly AvailabilityService $availabilityService
    ) {}

    public function search(SearchRoomsRequest $request): JsonResponse
    {
        $searchDTO = RoomSearchDTO::fromArray($request->validated());
        
        $roomTypes = $this->availabilityService->searchAvailableRooms($searchDTO);

        return response()->json([
            'data' => RoomTypeResource::collection($roomTypes),
            'meta' => [
                'total' => $roomTypes->count(),
                'check_in' => $searchDTO->checkInDate,
                'check_out' => $searchDTO->checkOutDate,
            ],
        ]);
    }

    public function index(): JsonResponse
    {
        $roomTypes = RoomType::with(['amenities', 'hotel'])
            ->where('is_active', true)
            ->paginate(15);

        return response()->json([
            'data' => RoomTypeResource::collection($roomTypes),
            'meta' => [
                'current_page' => $roomTypes->currentPage(),
                'last_page' => $roomTypes->lastPage(),
                'per_page' => $roomTypes->perPage(),
                'total' => $roomTypes->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $roomType = RoomType::with(['amenities', 'hotel', 'rooms'])
            ->findOrFail($id);

        return response()->json([
            'data' => new RoomTypeResource($roomType),
        ]);
    }
}
